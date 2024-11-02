import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TaskContextProvider } from "./tasks";

const queryClient = new QueryClient();

export default function ContextsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TaskContextProvider>{children}</TaskContextProvider>
    </QueryClientProvider>
  );
}
