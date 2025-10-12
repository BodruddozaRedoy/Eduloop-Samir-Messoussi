import { AxiosPublic } from '@/config/axios'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useGroup() {
  const { data, isLoading: groupLoading } = useQuery({
    queryKey: ["group"],
    queryFn: async () => {
      const res = await AxiosPublic.get("/groups/")
      return res.data.results
    },
    gcTime: 0,          // 👈 replaces cacheTime
    staleTime: 0,       // 👈 always stale
    refetchOnMount: true, // 👈 always refetch when remount
    refetchOnWindowFocus: false, // 👈 optional: don't refetch on tab focus
  })
  return { data, groupLoading }
}
