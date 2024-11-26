import { z } from "zod";

export const createFileSchema = z.object({
  name: z.string(),
  size: z.coerce.number(),
  type: z.string(),
  expirationTime: z.coerce.number(),
});
