import { useQuery } from "@tanstack/react-query";
import categories from "../assets/data/category.json";

export default function useCategories() {
  const { data, isLoading } = useQuery({
    queryKey: ["Categories"],
    queryFn: async () => categories, // directly return imported JSON
  });

  return { group:data?.groups, isLoading };
}
