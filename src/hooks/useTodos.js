import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export default function useTodos() {
  const queryResponse = useQuery({
    queryKey: ["todos"],
    queryFn: () => api("/todos"),
  });

  return queryResponse;
}
