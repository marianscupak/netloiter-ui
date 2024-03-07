import { z } from "zod";

export const objectWithId = z.object({ id: z.number() });
