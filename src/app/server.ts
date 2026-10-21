import "dotenv/config";
import { app } from "./app.js";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import mcpClient from "./mcp-client.js";
import { env } from "../config/env.js";

const transport = new StdioClientTransport({
  command: "docker",
  args: [
    "run",
    "-i",
    "--rm",
    "-e",
    "GITHUB_PERSONAL_ACCESS_TOKEN",
    "-e",
    "GITHUB_READ_ONLY=1",
    "-e",
    "GITHUB_TOOLSETS=repos",
    "-e",
    "GITHUB_TOOLS=list_commits",
    "ghcr.io/github/github-mcp-server",
  ],
  env: {
    GITHUB_PERSONAL_ACCESS_TOKEN: env.GITHUB_PERSONAL_ACCESS_TOKEN,
  },
});

const start = async () => {
  await mcpClient.connect(transport);

  const { tools } = await mcpClient.listTools();

  //console.log("Tools", tools);

  if (!tools.some((tool) => tool.name === "list_commits")) {
    throw new Error("list_commits aracı MCP Server'da bulunamadı.");
  }
  try {
    await app.listen({
      port: 3012,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
