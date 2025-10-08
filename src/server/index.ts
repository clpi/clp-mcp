import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import console from "node:console"
import process from "node:process"
import { } from "@smithery/sdk"
import {z} from "zod"

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
    description: "A simple MCP server for CLP",
    websiteUrl: "pecunies.com",
  });

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
    ({ name }) => ({
      content: [{ type: "text", text: `Initialized with ${name}!` }],
    }),
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
