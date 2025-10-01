import { AxiosPublic } from '@/config/axios'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useSubject(groupId) {
  const { data: subjects, isLoading } = useQuery({
    queryKey: ["subject"],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/subject/${groupId}/`)
      return res.data.results
    },
    enabled: !!groupId,
    gcTime: 0,          // 👈 replaces cacheTime
    staleTime: 0,       // 👈 always stale
    refetchOnMount: true, // 👈 always refetch when remount
    refetchOnWindowFocus: false, // 👈 optional: don't refetch on tab focus
  })

  return { subjects, isLoading }
}
