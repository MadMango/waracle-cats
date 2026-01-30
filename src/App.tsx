import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router } from "./Router";
import { theme } from "./theme";

const queryClient = new QueryClient();

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Router />
      </QueryClientProvider>
    </MantineProvider>
  );
}
