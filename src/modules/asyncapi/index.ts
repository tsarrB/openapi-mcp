import { pick } from "es-toolkit";
import { z } from "zod";
import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { buildErrorResult, buildSuccessResult } from "./utils";
import { getAsyncapiJson, AsyncapiJson } from "./api";
import { logger } from "../../services/logger";

export const registerAsyncapiTools = (server: McpServer) => {
  server.registerTool(
    "asyncapi.getApiInfo",
    {
      title: "Get API Info",
      description: "Return the API info.",
    },
    async () => {
      try {
        const asyncapiJson = await getAsyncapiJson();

        return buildSuccessResult(
          "Basic API info fetched: ",
          pick(asyncapiJson, ["asyncapi", "info", "servers", "tags", "defaultContentType"])
        );
      } catch (error) {
        logger.error({ err: error }, "Unable to fetch API info");

        return buildErrorResult("Unable to fetch API info", error);
      }
    }
  );


  server.registerTool(
    "asyncapi.getAllChannels",
    {
      title: "Get All Channels",
      description: "Return the all channels.",
    },
    async () => {
      try {
        const { channels } = await getAsyncapiJson();

        return buildSuccessResult(
          "All endpoints fetched: ",
          Object.keys(channels)
        );
      } catch (error) {
        return buildErrorResult("Unable to fetch all endpoints", error);
      }
    }
  );


  server.registerTool(
    "asyncapi.getChannelInfo",
    {
      title: "Get Channel Info",
      description: "Return the channel info.",
      inputSchema: {
        channel: z
          .string()
          .min(1)
          .describe("Channel for fetching info"),
      },
    },
    async ({ channel }) => {
      try {
        const { channels } = await getAsyncapiJson();

        if (!channels[channel]) {
          throw new Error(`Channel ${channel} not found`);
        }

        return buildSuccessResult(
          "Channel info fetched: ",
          channels[channel]
        );
      } catch (error) {
        return buildErrorResult("Unable to fetch channel info", error);
      }
    }
  );

  server.registerTool(
    "asyncapi.getSchemasByNames",
    {
      title: "Get schemas by names",
      description: "Return the schemas by names.",
      inputSchema: {
        schemaNames: z
          .array(z.string())
          .min(1)
          .describe("List of schema names for fetching"),
      },
    },
    async ({ schemaNames }) => {
      try {
        const {
          components: { schemas },
        } = await getAsyncapiJson();

        const result: AsyncapiJson["components"]["schemas"] = {};

        Object.entries(schemas).forEach(([name, schema]) => {
          const normalizedNames = schemaNames.map((name) => name.split('/').pop()?.toLowerCase());

          if (normalizedNames.includes(name.toLowerCase())) {
            result[name] = schema;
          }
        });

        return buildSuccessResult(
          "Schemas by names fetched: ",
          result
        );
      } catch (error) {
        return buildErrorResult(
          "Unable to fetch schemas by names",
          error
        );
      }
    }
  );
};
