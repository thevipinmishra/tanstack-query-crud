import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@fontsource-variable/syne";
import "./index.css";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors />
    </QueryClientProvider>
  </React.StrictMode>
);
