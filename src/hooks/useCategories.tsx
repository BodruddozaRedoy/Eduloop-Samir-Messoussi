import { useQuery } from "@tanstack/react-query";
// import categories from "../assets/data/category.json";
import { AxiosPublic } from "@/config/axios";

export default function useCategories(subjectId:any) {
  const { data, isLoading } = useQuery({
    queryKey: ["Categories"],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/categories/${subjectId}/`)
      return res.data.results
    }, // directly return imported JSON
  });

  return { categories:data, isLoading };
}
