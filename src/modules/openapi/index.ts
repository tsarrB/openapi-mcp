import { pick } from "es-toolkit";
import { z } from "zod";
import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { buildErrorResult, buildSuccessResult } from "./utils";
import { getOpenapiJson, OpenapiJson } from "./api";
import { logger } from "../../services/logger";

export const registerOpenapiTools = (server: McpServer) => {
  server.registerTool(
    "openapi.getApiInfo",
    {
      title: "Get API Info",
      description: "Return the API info.",
    },
    async () => {
      try {
        const openapiJson = await getOpenapiJson();

        return buildSuccessResult(
          "Basic API info fetched: ",
          pick(openapiJson, ["openapi", "info", "servers", "tags"])
        );
      } catch (error) {
        logger.error({ err: error }, "Unable to fetch API info");

        return buildErrorResult("Unable to fetch API info", error);
      }
    }
  );

  server.registerTool(
    "openapi.getEndpointsByTagsNames",
    {
      title: "Get Endpoints by tags names",
      description: "Return the endpoints by tags names.",
      inputSchema: {
        tagsNames: z
          .array(z.string())
          .min(1)
          .describe("List of tags names for fetching"),
      },
    },
    async ({ tagsNames }) => {
      try {
        const { paths } = await getOpenapiJson();

        const modulePaths: OpenapiJson["paths"] = {};

        Object.entries(paths).forEach(([path, methods]) => {
          Object.entries(methods).forEach(([method, operation]) => {
            operation.tags.forEach((tag) => {
              const tagsNamesNormalized = tagsNames.map((name) => name.toLowerCase());

              if (tagsNamesNormalized.includes(tag.toLowerCase())) {
                modulePaths[path] = modulePaths[path] || {};

                modulePaths[path][method] = operation;
              }
            });
          });
        });

        return buildSuccessResult(
          "Endpoints by tags names fetched: ",
          modulePaths
        );
      } catch (error) {
        return buildErrorResult(
          "Unable to fetch endpoints by tags names",
          error
        );
      }
    }
  );

  server.registerTool(
    "openapi.getSecuritySchemesByTagsNames",
    {
      title: "Get Security Schemes by security names",
      description: "Return the security schemes by security names.",
      inputSchema: {
        securityNames: z
          .array(z.string())
          .min(1)
          .describe("List of security names for fetching"),
      },
    },
    async ({ securityNames }) => {
      try {
        const {
          components: { securitySchemes },
        } = await getOpenapiJson();

        const result: OpenapiJson["components"]["securitySchemes"] = {};

        Object.entries(securitySchemes).forEach(
          ([securityName, securityScheme]) => {
            const securityNamesNormalized = securityNames.map((name) => name.toLowerCase());

            if (securityNamesNormalized.includes(securityName.toLowerCase())) {
              result[securityName] = securityScheme;
            }
          }
        );

        return buildSuccessResult(
          "Security schemes by security names fetched: ",
          result
        );
      } catch (error) {
        return buildErrorResult(
          "Unable to fetch security schemes by security names",
          error
        );
      }
    }
  );

  server.registerTool(
    "openapi.getSchemasByNames",
    {
      title: "Get Schemas by names",
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
        } = await getOpenapiJson();

        const result: OpenapiJson["components"]["securitySchemes"] = {};

        Object.entries(schemas).forEach(([name, schema]) => {
          const normalizedNames = schemaNames.map((name) => name.split('/').pop()?.toLowerCase());

          if (normalizedNames.includes(name.toLowerCase())) {
            result[name] = schema;
          }
        });

        return buildSuccessResult(
          "Security schemes by security names fetched: ",
          result
        );
      } catch (error) {
        return buildErrorResult(
          "Unable to fetch security schemes by security names",
          error
        );
      }
    }
  );
};
