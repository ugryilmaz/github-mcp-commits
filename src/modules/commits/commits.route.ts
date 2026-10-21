import { FastifyInstance } from "fastify";
import mcpClient from "../../app/mcp-client.js";

const OWNER = "ugryilmaz";
const REPO = "modern-backend-lab";

export const githubCommitRoutes = (app: FastifyInstance) => {
  app.get("/commits", async (request, reply) => {
    try {
      const result = await mcpClient.callTool({
        name: "list_commits",
        arguments: {
          owner: OWNER,
          repo: REPO,
          perPage: 10,
          fields: ["sha", "html_url", "commit"],
        },
      });

      if (result.isError) {
        request.log.error("GitHub MCP tool çağrısı başarısız.");

        return reply.code(502).send({
          error: "GitHub MCP tool çağrısı başarısız.",
        });
      }

      const commits = result.structuredContent ?? result.content;

      return {
        repository: `${OWNER}/${REPO}`,
        commits,
      };
    } catch (error) {
      request.log.error({ err: error }, "Commit listesi alınamadı.");

      return reply.code(502).send({
        error: "GitHub commit listesi alınamadı.",
      });
    }
  });
};
