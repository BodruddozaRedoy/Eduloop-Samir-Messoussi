import { AxiosPublic } from '@/config/axios'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useSubCategories(categoryId:number) {
  const {data:subCategories, isLoading:subcategoriesLoading} = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
        const res = await AxiosPublic.get(`/subcategories/${categoryId}`)
        return res.data.results
    }
  })
  return {subCategories, subcategoriesLoading}
}
