import { z } from "zod";

export const objectWithLoadedIdSchema = z.object({
  loadedId: z.number().optional(),
});
