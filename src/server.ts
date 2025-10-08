import { type Server } from "@modelcontextprotocol/sdk/server/index.js"
import { type Transport } from "@modelcontextprotocol/sdk/shared/transport.js"
import { } from "@smithery/sdk"
import { createStatefulServer, type CreateServerFn} from "@smithery/sdk/server/stateful.js"
import clpMcpConfig from "./config"
import console from "node:console"
import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export interface MemoryEntry {
  key: string;
  value: any;
  metadata?: {
    created: Date;
    updated: Date;
    tags?: string[];
    category?: string;
  };
}

export class ClpMcpServer {
  private _memory: Map<string, MemoryEntry> = new Map();
  private _contexts: Map<string, any> = new Map();
  private _reasoning: Array<{ timestamp: Date; context: string; decision: string }> = [];

  public store(key: string, value: any, tags?: string[], category?: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const now = new Date();
    const entry: MemoryEntry = {
      key,
      value,
      metadata: {
        created: this._memory.has(key) ? this._memory.get(key)!.metadata!.created : now,
        updated: now,
        tags,
        category,
      },
    };
    
    this._memory.set(key, entry);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `Stored: ${key} = ${JSON.stringify(value)}`,
        }
      ]
    };
  }

  public recall(key?: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    if (key) {
      const entry = this._memory.get(key);
      if (!entry) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Key not found: ${key}`,
            }
          ],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(entry, null, 2),
          }
        ]
      };
    }
    
    // Return all memory
    const allMemory = Array.from(this._memory.entries()).map(([k, v]) => ({
      key: k,
      value: v.value,
      metadata: v.metadata,
    }));
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(allMemory, null, 2),
        }
      ]
    };
  }

  public delete(key: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const deleted = this._memory.delete(key);
    return {
      content: [
        {
          type: "text" as const,
          text: deleted ? `Deleted: ${key}` : `Key not found: ${key}`,
        }
      ],
      isError: !deleted,
    };
  }

  public search(query: string, category?: string): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    const results = Array.from(this._memory.entries())
      .filter(([key, entry]) => {
        const matchesQuery = key.includes(query) || 
                            JSON.stringify(entry.value).includes(query) ||
                            (entry.metadata?.tags?.some(tag => tag.includes(query)) ?? false);
        const matchesCategory = !category || entry.metadata?.category === category;
        return matchesQuery && matchesCategory;
      })
      .map(([k, v]) => ({ key: k, value: v.value, metadata: v.metadata }));
    
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        }
      ]
    };
  }

  public addReasoning(context: string, decision: string): void {
    this._reasoning.push({
      timestamp: new Date(),
      context,
      decision,
    });
  }

  public getReasoningHistory(limit: number = 10): {
    content: Array<{ type: string; text: string }>;
  } {
    const recent = this._reasoning.slice(-limit);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(recent, null, 2),
        }
      ]
    };
  }

  public storeContext(contextId: string, context: any): void {
    this._contexts.set(contextId, {
      ...context,
      timestamp: new Date(),
    });
  }

  public getContext(contextId: string): any {
    return this._contexts.get(contextId);
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