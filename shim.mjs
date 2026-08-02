#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import { wrapAxiosWithPayment, x402Client } from "@x402/axios";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const BASE_URL = process.env.VERIFY_URL || "https://verify.inferenceview.com";
const key = process.env.EVM_PRIVATE_KEY;
if (!key) {
  console.error("EVM_PRIVATE_KEY required (funded Base USDC wallet)");
  process.exit(1);
}

const client = new x402Client();
registerExactEvmScheme(client, { signer: privateKeyToAccount(key) });
const api = wrapAxiosWithPayment(axios.create({ baseURL: BASE_URL }), client);
const server = new McpServer({ name: "verify-by-inferenceview", version: "1.1.0" });

server.tool(
  "verify_transaction",
  "Before paying an unknown x402/MCP resource, return risk, recommendation, and evidence. The live x402 challenge controls the price.",
  { url: z.string().url().describe("The x402 resource URL you are about to pay") },
  async ({ url }) => {
    const response = await api.post("/check", { url });
    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
  },
);

server.tool(
  "factcheck",
  "Verify a factual claim before acting on it. Returns a verdict, confidence, primary sources, freshness, contradictions, and evidence.",
  {
    claim: z.string().min(8).max(1500).describe("The statement to verify"),
    depth: z.enum(["quick", "standard", "deep"]).default("standard"),
    context: z.object({
      url: z.string().optional(),
      company: z.string().optional(),
      person: z.string().optional(),
      product: z.string().optional(),
      data_point: z.string().optional(),
    }).optional(),
  },
  async ({ claim, depth, context }) => {
    const response = await api.post(`/factcheck/${depth}`, { claim, context });
    return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
  },
);

await server.connect(new StdioServerTransport());
