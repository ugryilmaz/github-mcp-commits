import Fastify from "fastify";

import { githubCommitRoutes } from "../modules/commits/commits.route.js";
import mcpClient from "./mcp-client.js";
import healthRoutes from "./routes/health.routes.js";

export const app = Fastify({
  logger: true,
});
app.register(healthRoutes);
app.register(githubCommitRoutes);

app.addHook("onClose", async () => {
  await mcpClient.close();
});
