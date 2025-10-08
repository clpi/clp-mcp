import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import console from "node:console"
import process from "node:process"
import { } from "@smithery/sdk"
import {z} from "zod"
import { LongTermMemory, MemoryEntrySchema } from "../memory/index.js"

export class ClpMcp {
  readonly name: string = "clp-mcp"
  readonly version: string = "0.0.1"
  readonly title: string = "CLP MCP"
  readonly description: string = "A simple MCP server for CLP"
  readonly websiteUrl: string = "pecunies.com"
}

export const configSchema = z.object({
  debug: z.boolean().default(false),
})

export default function serve({ config, }: { config: z.infer<typeof configSchema>; } ) {
  // If you want to support SSE, you can check for the --sse flag
  // and set up your server accordingly 
  if (config.debug) {
    console.log("Debug mode is enabled.");
  }
  if (process.argv.includes("--sse")) {
    console.log("SSE mode is not supported yet.");
  }

  const mcp = new McpServer({
    name: "clp-mcp",
    version: "0.0.1",
    title: "CLP MCP",
    description: "A simple MCP server for CLP with dynamic long-term memory",
    websiteUrl: "pecunies.com",
  });

  // Initialize long-term memory system
  const memory = new LongTermMemory();

  // Add a tool
  mcp.registerTool(
    "init",
    {
      title: "init",
      description: "Initialize something",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("The text content"),
          }),
        ),
      } ,
      inputSchema: { name: z.string().describe("Initialize something") },
    },
    ({ name }) => ({
      content: [{ type: "text", text: `Initialized with ${name}!` }],
    }),
  );

  // Memory Tools
  mcp.registerTool(
    "memory_store",
    {
      title: "Store Memory",
      description: "Store a new memory with optional context, tags, importance, and metadata",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("The stored memory details"),
          }),
        ),
      },
      inputSchema: {
        content: z.string().describe("The content to store in memory"),
        context: z.string().optional().describe("Context or category for the memory"),
        tags: z.array(z.string()).optional().describe("Tags for categorization"),
        importance: z.number().min(0).max(1).optional().describe("Importance score (0-1)"),
        metadata: z.record(z.any()).optional().describe("Additional metadata"),
      },
    },
    ({ content, context, tags, importance, metadata }) => {
      const storedMemory = memory.store({
        content,
        context,
        tags,
        importance,
        metadata,
      });
      return {
        content: [
          {
            type: "text",
            text: `Memory stored successfully!\n\nID: ${storedMemory.id}\nContent: ${storedMemory.content}\nContext: ${storedMemory.context || "None"}\nTags: ${storedMemory.tags.join(", ") || "None"}\nImportance: ${storedMemory.importance}\nTimestamp: ${new Date(storedMemory.timestamp).toISOString()}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_recall",
    {
      title: "Recall Memories",
      description: "Recall memories based on various criteria including query, context, tags, importance, and time range",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("The recalled memories"),
          }),
        ),
      },
      inputSchema: {
        query: z.string().optional().describe("Search query for full-text search"),
        context: z.string().optional().describe("Filter by context"),
        tags: z.array(z.string()).optional().describe("Filter by tags"),
        limit: z.number().optional().describe("Maximum number of results (default: 10)"),
        minImportance: z.number().min(0).max(1).optional().describe("Minimum importance score"),
      },
    },
    ({ query, context, tags, limit, minImportance }) => {
      const memories = memory.recall({
        query,
        context,
        tags,
        limit,
        minImportance,
      });

      if (memories.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No memories found matching the criteria.",
            },
          ],
        };
      }

      const memoriesText = memories
        .map(
          (m, i) =>
            `${i + 1}. [${new Date(m.timestamp).toISOString()}]\n   ID: ${m.id}\n   Content: ${m.content}\n   Context: ${m.context || "None"}\n   Tags: ${m.tags.join(", ") || "None"}\n   Importance: ${m.importance}\n   Access Count: ${m.accessCount}\n   Related: ${m.relatedMemories.length} memories`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Found ${memories.length} memories:\n\n${memoriesText}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_search",
    {
      title: "Search Memories",
      description: "Search memories with full-text search",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Search results"),
          }),
        ),
      },
      inputSchema: {
        query: z.string().describe("Search query"),
        limit: z.number().optional().describe("Maximum number of results (default: 10)"),
      },
    },
    ({ query, limit }) => {
      const results = memory.search(query, limit);

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No memories found for query: "${query}"`,
            },
          ],
        };
      }

      const resultsText = results
        .map(
          (m, i) =>
            `${i + 1}. ${m.content}\n   [${new Date(m.timestamp).toISOString()}] - Importance: ${m.importance}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Search results for "${query}":\n\n${resultsText}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_get_recent",
    {
      title: "Get Recent Memories",
      description: "Get the most recent memories",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Recent memories"),
          }),
        ),
      },
      inputSchema: {
        limit: z.number().optional().describe("Maximum number of results (default: 10)"),
      },
    },
    ({ limit }) => {
      const recent = memory.getRecent(limit);

      if (recent.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No memories stored yet.",
            },
          ],
        };
      }

      const recentText = recent
        .map(
          (m, i) =>
            `${i + 1}. [${new Date(m.timestamp).toISOString()}] ${m.content.substring(0, 100)}${m.content.length > 100 ? "..." : ""}`
        )
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Recent memories:\n\n${recentText}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_get_important",
    {
      title: "Get Important Memories",
      description: "Get the most important memories",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Important memories"),
          }),
        ),
      },
      inputSchema: {
        minImportance: z.number().min(0).max(1).optional().describe("Minimum importance (default: 0.7)"),
        limit: z.number().optional().describe("Maximum number of results (default: 10)"),
      },
    },
    ({ minImportance, limit }) => {
      const important = memory.getImportant(minImportance, limit);

      if (important.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No important memories found.",
            },
          ],
        };
      }

      const importantText = important
        .map(
          (m, i) =>
            `${i + 1}. [Importance: ${m.importance}] ${m.content}\n   ${new Date(m.timestamp).toISOString()}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text",
            text: `Important memories:\n\n${importantText}`,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_stats",
    {
      title: "Memory Statistics",
      description: "Get statistics about the memory system",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Memory statistics"),
          }),
        ),
      },
      inputSchema: {},
    },
    () => {
      const stats = memory.getStats();
      const statsText = [
        "Memory System Statistics:",
        "",
        `Total Memories: ${stats.totalMemories}`,
        `Total Contexts: ${stats.totalContexts}`,
        `Total Tags: ${stats.totalTags}`,
        `Average Importance: ${stats.avgImportance.toFixed(2)}`,
        stats.oldestMemory
          ? `Oldest Memory: ${new Date(stats.oldestMemory).toISOString()}`
          : "Oldest Memory: N/A",
        stats.newestMemory
          ? `Newest Memory: ${new Date(stats.newestMemory).toISOString()}`
          : "Newest Memory: N/A",
      ].join("\n");

      return {
        content: [
          {
            type: "text",
            text: statsText,
          },
        ],
      };
    }
  );

  mcp.registerTool(
    "memory_consolidate",
    {
      title: "Consolidate Memories",
      description: "Analyze memories to identify patterns and generate summaries",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("Consolidation results"),
          }),
        ),
      },
      inputSchema: {
        context: z.string().optional().describe("Consolidate memories for a specific context"),
      },
    },
    ({ context }) => {
      const result = memory.consolidate(context);

      const patternsText =
        result.patterns.length > 0
          ? result.patterns
              .map((p) => `- ${p.pattern}: ${p.count} memories`)
              .join("\n")
          : "No patterns found";

      const consolidationText = [
        "Memory Consolidation Results:",
        "",
        "Patterns:",
        patternsText,
        "",
        result.summary,
      ].join("\n");

      return {
        content: [
          {
            type: "text",
            text: consolidationText,
          },
        ],
      };
    }
  );
  // Memory Resources
  mcp.registerResource(
    "all_memories",
    "memory://all",
    {
      title: "All Memories",
      description: "Access all stored memories",
    },
    (uri) => {
      const allMemories = memory.export();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(allMemories, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  mcp.registerResource(
    "memory_stats",
    "memory://stats",
    {
      title: "Memory Statistics",
      description: "Current statistics about the memory system",
    },
    (uri) => {
      const stats = memory.getStats();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(stats, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  mcp.registerResource(
    "recent_memories",
    "memory://recent",
    {
      title: "Recent Memories",
      description: "Most recently stored memories",
    },
    (uri) => {
      const recent = memory.getRecent(20);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(recent, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  mcp.registerResource(
    "important_memories",
    "memory://important",
    {
      title: "Important Memories",
      description: "High-importance memories",
    },
    (uri) => {
      const important = memory.getImportant(0.7, 20);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(important, null, 2),
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  // Add a resource
  mcp.registerResource(
    "repositories",
    "clp://repositories",
    {
      title: "Git Repositories",
      description: "The origin story of the famous 'Hello, World' program",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: '"Hello, World" first appeared in a 1972 Bell Labs memo by Brian Kernighan and later became the iconic first program for beginners in countless languages.',
          mimeType: "text/plain",
          inputSchema: z.object({
            title: z.string().describe("Title of the text entry"),
            author: z.string().optional().describe("Author of the text entry"),
            url: z.string().describe("URL of the text entry"),
          }),
        },
      ],
    }),
  );

  // Add a prompt
  mcp.registerPrompt(
    "find",
    {
      title: "find",
      description: "Find a file or repository",
      argsSchema: {
        dir: z.string().describe("Dir"),
        name: z.string().describe("Name of the person to greet"),
      },
    },
    ({ name }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Say hello to ${name}`,
            },
          },
        ],
      };
    },
  );

  return mcp.server;
}
