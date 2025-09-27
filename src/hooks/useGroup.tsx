import { AxiosPublic } from '@/config/axios'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useGroup() {
  const {data, isLoading:groupLoading} = useQuery({
    queryKey: ["group"],
    queryFn: async () => {
        const res = await AxiosPublic.get("/groups/")
        return res.data.results
    }
  })
  return {data, groupLoading}
}
