import { z } from "zod";

const ENV_SCHEMA = z.object({
  ASYNCAPI_JSON_SOURCE: z.enum(["endpoint", "path"]).default("endpoint"),
  ASYNCAPI_JSON_ENDPOINT: z.string().optional(),
  ASYNCAPI_JSON_PATH: z.string().optional(),

  OPENAPI_JSON_SOURCE: z.enum(["endpoint", "path"]).default("endpoint"),
  OPENAPI_JSON_ENDPOINT: z.string().optional(),
  OPENAPI_JSON_PATH: z.string().optional(),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  LOG_DESTINATION: z.string().default(".logs/app.log"),
});

export const parseEnv = (env: NodeJS.ProcessEnv = process.env) => {
  const result = ENV_SCHEMA.safeParse(env);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${message}`);
  }

  return result.data;
};

const getIsAsyncapiEndpointConfigured = (env: ReturnType<typeof parseEnv>) => {
  return env.ASYNCAPI_JSON_ENDPOINT && env.ASYNCAPI_JSON_SOURCE === "endpoint";
};

const getIsAsyncapiJsonPathConfigured = (env: ReturnType<typeof parseEnv>) => {
  return env.ASYNCAPI_JSON_PATH && env.ASYNCAPI_JSON_SOURCE === "path";
};

const getIsOpenapiEndpointConfigured = (env: ReturnType<typeof parseEnv>) => {
  return env.OPENAPI_JSON_ENDPOINT && env.OPENAPI_JSON_SOURCE === "endpoint";
};

const getIsOpenapiJsonPathConfigured = (env: ReturnType<typeof parseEnv>) => {
  return env.OPENAPI_JSON_PATH && env.OPENAPI_JSON_SOURCE === "path";
};

export const config = parseEnv();

export const isAsyncapiEndpointConfigured = getIsAsyncapiEndpointConfigured(config);
export const isAsyncapiJsonPathConfigured = getIsAsyncapiJsonPathConfigured(config);
export const isOpenapiEndpointConfigured = getIsOpenapiEndpointConfigured(config);
export const isOpenapiJsonPathConfigured = getIsOpenapiJsonPathConfigured(config);