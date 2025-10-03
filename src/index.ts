#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerOpenapiTools } from "./modules/openapi";
import { registerAsyncapiTools } from "./modules/asyncapi";
import { logger } from "./services/logger";
import {
  isAsyncapiEndpointConfigured,
  isAsyncapiJsonPathConfigured,
  isOpenapiEndpointConfigured,
  isOpenapiJsonPathConfigured,
} from "./config";

const server = new McpServer({
  name: "openapi-mcp",
  version: "1.0.0",
});

if (isOpenapiJsonPathConfigured || isOpenapiEndpointConfigured) {
  registerOpenapiTools(server);
}

if (isAsyncapiJsonPathConfigured || isAsyncapiEndpointConfigured) {
  registerAsyncapiTools(server);
}

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    logger.error({ err: error }, "Error while starting MCP server");
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error({ err: error }, "Error running main loop");
  process.exit(1);
});
