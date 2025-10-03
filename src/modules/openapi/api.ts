import fs from "fs";
import { ofetch } from "ofetch";

import { config, isOpenapiJsonPathConfigured, isOpenapiEndpointConfigured } from "../../config";
import { logger } from "../../services/logger";

interface OpenapiJsonPathMethodOperation {
  operationId: string;
  parameters: any[];
  responses: Record<string, any>;
  summary: string;
  tags: string[];
}

export interface OpenapiJson {
  openapi: string;
  info: Record<string, any>;
  servers: Record<string, any>;
  tags: Record<string, any>;
  paths: Record<string, Record<string, OpenapiJsonPathMethodOperation>>;
  components: {
    securitySchemes: Record<string, any>;
    schemas: Record<string, any>;
  };
}

export const getOpenapiJson = async (): Promise<OpenapiJson> => {
  if (isOpenapiJsonPathConfigured) {
    try {
      const response = fs.readFileSync(config.OPENAPI_JSON_PATH, "utf8");

      if (JSON.parse(response).openapi) {
        return JSON.parse(response);
      }

      throw new Error('Something went wrong');
    } catch (error) {
      throw new Error(`Invalid OpenAPI JSON response from path ${config.OPENAPI_JSON_PATH}, error: ${error}`);
    }
  } else {
    try {
      const response = await ofetch(config.OPENAPI_JSON_ENDPOINT);

      logger.info({ response }, "OpenAPI JSON response");
  
      if (response.openapi) {
        return response;
      }
  
      throw new Error('Something went wrong');
    } catch (error) {
      throw new Error(`Invalid OpenAPI JSON response from endpoint: ${config.OPENAPI_JSON_ENDPOINT}, error: ${error}`);
    }
  }
};