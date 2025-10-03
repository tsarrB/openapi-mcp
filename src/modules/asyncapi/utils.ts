import { prepareToolTextResult } from "../../helpers/prepareToolResult";

export const buildSuccessResult = (message: string, payload: unknown) =>
  prepareToolTextResult(
    `${message}: ${JSON.stringify(payload, null, 0)}`
  );

export const buildErrorResult = (message: string, error: unknown) =>
  prepareToolTextResult(`${message}: ${JSON.stringify(error, null, 0)}`);
