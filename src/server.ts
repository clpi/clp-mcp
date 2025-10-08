import { type Server } from "@modelcontextprotocol/sdk/server/index.js"
import { type Transport } from "@modelcontextprotocol/sdk/shared/transport.js"
import { } from "@smithery/sdk"
import { createStatefulServer, type CreateServerFn} from "@smithery/sdk/server/stateful.js"
import clpMcpConfig from "./config"
import console from "node:console"
import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export class ClpMcpServer {
  private _memory: Record<string, any> = {};
  private _branches: Record<string, any> = {}

  private store(input: unknown): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(this._memory),
        }
      ]  
    }

  }

  public recall(input: unknown): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(this._memory),
        }
      ]
    }

  }


}
export default function createStatelessServer({
  config,
}: {
  config: z.infer<typeof clpMcpConfig>
}) {
  const server = new McpServer({
    name: "clp-mcp",
    title: "CLP MCP",
    websiteUrl: "https://clp.im",
    version: "0.0.1",
  })
  const mem = new ClpMcpServer()
  server.tool("init", "Initialize a workspace", () => {
    return {
      isError: false,
      structuredContent: {

      },
      content: [
        {
          data: "Workspace initialized",
          name: "init",
          type: "text",
          text: "Workspace initialized",
          _meta: {}
        }
      ]

    }
  })
  return server.server
}