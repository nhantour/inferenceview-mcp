# InferenceView MCP

Use InferenceView from any Model Context Protocol client to check an x402/MCP
resource before paying it or to fact-check a claim before acting on it.

The local MCP process keeps your wallet key on your machine and pays the remote
InferenceView API over x402. The key is never sent to InferenceView.

## Tools

- `verify_transaction` — returns risk, recommendation and evidence about an
  x402 resource before payment. Current price: $0.01 USDC on Base.
- `factcheck` — returns a supported/refuted/mixed/unverifiable verdict with
  sources. Current tiers: $0.05, $0.10 and $0.25 USDC on Base.

Always trust the live x402 challenge over prices copied into documentation.

## Install

```bash
npm install
```

Configure your MCP client:

```json
{
  "mcpServers": {
    "inferenceview": {
      "command": "node",
      "args": ["/absolute/path/to/inferenceview-mcp/shim.mjs"],
      "env": {
        "EVM_PRIVATE_KEY": "your-funded-base-wallet-key"
      }
    }
  }
}
```

The wallet needs Base USDC. Keep the private key in your client's secret store;
never commit it or paste it into an issue.

## Machine-readable interfaces

- Product: https://inferenceview.com/
- OpenAPI: https://verify.inferenceview.com/openapi.json
- Hosted shim source: https://verify.inferenceview.com/shim.mjs
- Live service health: https://verify.inferenceview.com/health

## Evidence boundary

VERIFY preflight and x402 payment are live. This repository does not claim
customer deployment of InferenceView's broader postflight platform, material
revenue, endorsements or marketplace partnerships.

Copyright © Intelix Systems LLC. No license is granted beyond running this MCP
client to access the documented InferenceView service.
