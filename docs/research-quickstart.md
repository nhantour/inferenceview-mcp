# Research quickstart: payment observations and service offers

Use this workflow to investigate Tempo transaction records and advertised x402
service prices, then publish a finding a reader can check. Record the collection
date and coverage before calculating totals.

## Choose the right interface

This repository's local shim exposes two paid VERIFY tools: `verify_transaction`
checks an x402 resource URL before payment, and `factcheck` evaluates a factual
claim. Despite its name, `verify_transaction` takes a resource URL, not a Tempo
transaction hash. These tools do not query the public transaction dataset.

For transaction observations, use the free read-only HTTP API documented at
[inferenceview.com/developers](https://inferenceview.com/developers) and its
[OpenAPI specification](https://inferenceview.com/openapi.json). No wallet or API
key is required for these public reads. Start with a small sample:

```bash
curl --fail --silent --show-error 'https://inferenceview.com/api/status'
curl --fail --silent --show-error 'https://inferenceview.com/api/coverage'
curl --fail --silent --show-error 'https://inferenceview.com/api/transactions?limit=5'
```

For provider research, connect a Streamable HTTP MCP client to
`https://inferenceview.com/api/mcp`. Its read-only tools are `search_providers`,
`get_provider`, `get_intelligence_status`, `get_service_offers`,
`get_service_changes` and `get_service_history`. This is a separate connection
from the local VERIFY shim. The developer documentation lists the equivalent
HTTP endpoints.

## Define the denominator

Choose a counting unit: transaction, transfer event, initiating address or linked
service purchase. An address count does not establish a number of people or
agents. A successful transaction does not establish delivery or task quality.

Set `since` inclusive and `until` exclusive using UTC Unix seconds. Inspect the
covered intervals; missing intervals are unknown, not zero activity. Hold
`until` fixed while paginating, deduplicate network-and-hash pairs and account
for late arrivals. Separate API requests do not share a frozen snapshot.

Keep token contracts and decimal precision with every amount. Sum comparable
assets separately. For an average known amount, divide the known-value total by
the count of known values, including known zeros. Report unknown-value counts
alongside the result. Fees belong in a separate field. A nominal one-dollar
stablecoin convention must be labeled as an assumption.

The [Tempo reading guide](https://inferenceview.com/learn/tempo-transaction-data)
and [agent-payment metrics guide](https://inferenceview.com/learn/agent-payment-metrics)
explain these distinctions with explicitly illustrative examples.

## Compare offers at the task level

Use provider records and offer history to identify the exact endpoint, billing
unit, asset, advertised amount and observation time. Define the requested inputs,
output requirements and acceptance test before comparing prices. Different
payment options on one service do not establish different independent providers.

An advertised offer or dated endpoint check does not establish a completed
purchase, actual charge, uptime or output quality. Keep those claims separate.
The [x402 pricing guide](https://inferenceview.com/learn/agent-service-pricing)
shows how per-request prices can produce different costs for the same workload.

## Leave an evidence trail

Save the query, retrieval time in UTC, source/network, filters, field definitions,
covered intervals and counting rule with your analysis. Link the exact dataset,
guide or representative record. A live URL can change; preserve a dated extract
and its manifest when reproducibility matters. Follow the
[citation template and research standards](https://inferenceview.com/about#citation)
and the [data-use terms](https://inferenceview.com/terms#data).

Interface names and documentation reviewed on 2026-09-13. Check the live
specification before integrating; use caching and follow its rate-limit guidance.
