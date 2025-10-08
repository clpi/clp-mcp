
export const GitRepository = z.object({
  author: z.string().describe("Author of the repository"),
  name: z.string().describe("Name of the repository"),
  url: z.string().url().describe("URL of the repository"),
});
