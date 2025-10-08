import { z } from "zod";

export const clpMcpConfig = z.object({

  debug: z.boolean().default(false).describe("Enable debug mode"),
} )

export default clpMcpConfig;