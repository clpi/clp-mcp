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
import serve from "./server/index.ts"
import { Command } from "commander";

export const cli = new Command("clp-mcp")
  .option("--debug <bool>", "Enable debug mode", "false")
  .option("--port <number>", "Port to run the server on", "3000")
  .command("start", "Start the MCP server")
  .description("Start the MCP server")
  .command("config", "Configure the MCP server")
  .helpOption()
  .action(async (options) => {
    const debug = options.debug === "true";
    const port = parseInt(options.port, 10);
      
    if (debug) {
      console.log("Debug mode is enabled");
    }
    console.log(`Starting server on port ${port}...`);
    serve({ config: { debug: false } });
    // Here you would call your server start function, e.g., serve(port);
  });

cli.parse(process.argv); 

export default serve;
