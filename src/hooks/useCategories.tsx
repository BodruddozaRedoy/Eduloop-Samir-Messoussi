import { useQuery } from "@tanstack/react-query";
// import categories from "../assets/data/category.json";
import { AxiosPublic } from "@/config/axios";

export default function useCategories(subjectId: any) {
  const { data, isLoading } = useQuery({
    queryKey: ["Categories"],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/categories/${subjectId}/`)
      return res.data.results
    }, // directly return imported JSON
    enabled: !!subjectId,
    gcTime: 0,          // 👈 replaces cacheTime
    staleTime: 0,       // 👈 always stale
    refetchOnMount: true, // 👈 always refetch when remount
    refetchOnWindowFocus: false, // 👈 optional: don't refetch on tab focus
  });

  return { categories: data, isLoading };
}
