import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, trpcClient, trpc } from "./utils/trpc";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./utils/mui";
import { router } from "./utils/routes";

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
