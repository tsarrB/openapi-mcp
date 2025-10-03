import { type CallToolResult } from "@modelcontextprotocol/sdk/types";

export const prepareToolTextResult = (
  ...results: string[]
): CallToolResult | Promise<CallToolResult> => {
  return {
    content: results.map((result) => ({
      type: "text",
      text: result,
    })),
  };
};
