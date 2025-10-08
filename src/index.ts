/**
 * 👋 Welcome to your Smithery project!
 * To run your server, run "npm run dev"
 *
 * You might find these resources useful:
 *
 * 🧑‍💻 MCP's TypeScript SDK (helps you define your server)
 * https://github.com/modelcontextprotocol/typescript-sdk
 *
 * 📝 smithery.yaml (defines user-level config, like settings or API keys)
 * https://smithery.ai/docs/build/project-config/smithery-yaml
 *
 * 💻 smithery CLI (run "npx @smithery/cli dev" or explore other commands below)
 * https://smithery.ai/docs/concepts/cli
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Optional: If you have user-level config, define it here
// This should map to the config in your smithery.yaml file
export const configSchema = z.object({
  debug: z.boolean().default(false).describe("Enable debug logging"),
});

export const GitRepository = z.object({
  author: z.string().describe("Author of the repository"),
  name: z.string().describe("Name of the repository"),
  url: z.string().url().describe("URL of the repository"),
});
export const ClpMcp = z.object({
  name: z.literal("clp-mcp"),
  websiteUrl: z.literal("pecunies.com"),
  title: z.literal("CLP MCP"),
  description: z.literal("A simple MCP server for CLP"),
  version: z.literal("0.0.1"),
});
export default function createServer({
  config,
}: {
  config: z.infer<typeof configSchema>; // Define your config in smithery.yaml
}) {
  const mcp = new McpServer({
    name: "clp-mcp",
    version: "0.0.1",
    title: "CLP MCP",
    description: "A simple MCP server for CLP",
    websiteUrl: "pecunies.com",
  });

  // Add a tool
  mcp.registerTool(
    "init",
    {
      title: "init",
      description: "Initialize something",
      inputSchema: { name: z.string().describe("Initialize something") },
    },
    async ({ name }) => ({
      content: [{ type: "text", text: `Initialized with ${name}!` }],
    }),
  );

  mcp.registerTool(
    "add",
    {
      title: "add",
      description: "Add context",
      outputSchema: {
        content: z.array(
          z.object({
            type: z.literal("text"),
            text: z.string().describe("The text content"),
          }),
        ),
      },
      inputSchema: { name: z.string().describe("Add context") },
    },
    async ({ name }) => ({
      content: [{ type: "text", text: `Initialized with ${name}!` }],
    }),
  );
  // Add a resource
  mcp.registerResource(
    "hello-world-history",
    "history://hello-world",
    {
      title: "Hello World History",
      description: "The origin story of the famous 'Hello, World' program",
    },
    async (uri) => ({
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
    "greet",
    {
      title: "Hello Prompt",
      description: "Say hello to someone",
      argsSchema: {
        name: z.string().describe("Name of the person to greet"),
      },
    },
    async ({ name }) => {
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
