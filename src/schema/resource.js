import { z } from "zod";

export const StatusEnum = z.enum(["active", "inactive"]);

export const resourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().min(1, "Url is required"),
  type: z.string().min(1, "Type is required"),
  size: z.coerce.number().int().positive(),
  expiration: z.coerce.number().int().positive(),
});
