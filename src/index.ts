#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerOpenapiTools } from "./modules/openapi";
import { logger } from "./services/logger";

const server = new McpServer({
  name: "openapi-mcp",
  version: "1.0.0",
});

registerOpenapiTools(server);

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
