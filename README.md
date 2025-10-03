# OpenAPI MCP Server which actually works

Model Context Protocol (MCP) server that exposes helpful tools for exploring an OpenAPI specification. It can fetch the specification from an HTTP endpoint or from a local JSON file and surfaces curated slices of it to MCP-compatible clients.

## Features
- Fetch high-level API metadata (version, info, servers, tags)
- Discover REST endpoints filtered by tag names
- Retrieve security schemes referenced by name
- Look up OpenAPI schemas by component name
- Structured logging with configurable destination and verbosity

## How install
Add to your `mcpServers` section in `mcp.json` file:

```json
{
  "mcpServers": {
    "openapi-mcp": {
      "command": "npx",
      "args": ["-y", "@tsarr/openapi-mcp"],
      "env": {
        "OPENAPI_JSON_SOURCE": "endpoint",
        "OPENAPI_JSON_ENDPOINT": "{OPTIONAL_PATH_TO_YOUR_OPENAPI_ENDPOINT}",
        "OPENAPI_JSON_PATH": "{OPTIONAL_PATH_TO_YOUR_OPENAPI_JSON_FILE}",

        "ASYNCAPI_JSON_SOURCE": "endpoint",
        "ASYNCAPI_JSON_ENDPOINT": "{OPTIONAL_PATH_TO_YOUR_ASYNCAPI_ENDPOINT}",
        "ASYNCAPI_JSON_PATH": "{OPTIONAL_PATH_TO_YOUR_ASYNCAPI_JSON_FILE}"
      }
    }
  }
}
```

You can choose to fetch the OpenAPI or AsyncAPI JSON from an HTTP endpoint or from a local JSON file.

## Problems and solutions
TODO: add problems and solutions

## Local development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the TypeScript sources (generated in `build/`):
   ```bash
   npm run build
   ```
3. Start the MCP server (reads configuration from environment variables):
   ```bash
   npm start
   ```

During development you can rebuild on file changes with:
```bash
npm run dev
```

## Configuration
The server reads its configuration from environment variables. Create a `.env` file or export them before running the server.

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAPI_JSON_SOURCE` | optional (`endpoint` or `path`, default `endpoint`) | Selects whether the OpenAPI document is fetched from an HTTP endpoint or read from disk. |
| `OPENAPI_JSON_ENDPOINT` | required when source is `endpoint` | Fully-qualified URL that returns the OpenAPI JSON document. |
| `OPENAPI_JSON_PATH` | required when source is `path` | Absolute or relative path to a local OpenAPI JSON file. |
| `LOG_LEVEL` | optional (`fatal` through `trace`, default `info`) | Pino logger level. |
| `LOG_DESTINATION` | optional (default `.logs/app.log`) | `stdout` to log to the console or a file path where logs should be written. Intermediate directories are created automatically. |

At least one of `OPENAPI_JSON_ENDPOINT` or `OPENAPI_JSON_PATH` must be provided depending on the chosen source. Missing or invalid configuration halts the process with a descriptive message.

## Available Tools
Once connected to an MCP-compatible client, the server registers the following tools under the `openapi` namespace:
- `openapi.getApiInfo` – returns basic metadata (OpenAPI version, info object, servers, tags)
- `openapi.getEndpointsByTagsNames` – filters the `paths` object by matching tag names
- `openapi.getSecuritySchemesByTagsNames` – selects specific security schemes by key
- `openapi.getSchemasByNames` – retrieves component schemas by name (case-insensitive)

## License
ISC
