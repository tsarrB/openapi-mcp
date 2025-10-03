import fs from "fs";
import { ofetch } from "ofetch";

import { config, isAsyncapiJsonPathConfigured } from "../../config";
import { logger } from "../../services/logger";

interface AsyncapiChanelOperation {
  operationId: string;
  message: string;
  payload: Record<string, any>;
}

export interface AsyncapiJson {
  asyncapi: string;
  info: Record<string, any>;
  tags: {
    name: string;
    description: string;
  }[];
  servers: Record<string, {
    url: string;
    protocol: string;
    description: string;
  }>;
  components: {
    securitySchemes: Record<string, any>;
    schemas: Record<string, any>;
  };
  defaultContentType: string;
  channels: Record<string, Record<string, AsyncapiChanelOperation>>;
}

export const getAsyncapiJson = async (): Promise<AsyncapiJson> => {
  if (isAsyncapiJsonPathConfigured) {
    try {
      const response = fs.readFileSync(config.ASYNCAPI_JSON_PATH, "utf8");

      if (JSON.parse(response).asyncapi) {
        return JSON.parse(response);
      }

      throw new Error('Something went wrong');
    } catch (error) {
      throw new Error(`Invalid AsyncAPI JSON response from path ${config.ASYNCAPI_JSON_PATH}, error: ${error}`);
    }
  } else {
    try {
      const response = await ofetch(config.ASYNCAPI_JSON_ENDPOINT);

      logger.info({ response }, "AsyncAPI JSON response");
  
      if (response.asyncapi) {
        return response;
      }
  
      throw new Error('Something went wrong');
    } catch (error) {
      throw new Error(`Invalid AsyncAPI JSON response from endpoint: ${config.ASYNCAPI_JSON_ENDPOINT}, error: ${error}`);
    }
  }
};