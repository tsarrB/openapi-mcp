import { z } from "zod";

const ENV_SCHEMA = z.object({
  OPENAPI_JSON_SOURCE: z.enum(["endpoint", "path"]).default("endpoint"),
  OPENAPI_JSON_ENDPOINT: z.string(),
  OPENAPI_JSON_PATH: z.string(),

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

const getIsOpenapiEndpointConfigured = (env: ReturnType<typeof parseEnv>) => {
  return env.OPENAPI_JSON_ENDPOINT && env.OPENAPI_JSON_SOURCE === "endpoint";
};

const getIsOpenapiJsonPathConfigured = (env: ReturnType<typeof parseEnv>) => {
  return env.OPENAPI_JSON_PATH && env.OPENAPI_JSON_SOURCE === "path";
};

export const config = parseEnv();

export const isOpenapiEndpointConfigured = getIsOpenapiEndpointConfigured(config);
export const isOpenapiJsonPathConfigured = getIsOpenapiJsonPathConfigured(config);