import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/trpc-routers";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:2022",
    }),
  ],
});
