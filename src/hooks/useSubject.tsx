import { AxiosPublic } from '@/config/axios'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function useSubject(groupId) {
  const {data:subjects, isLoading} = useQuery({
    queryKey: ["subject"],
    queryFn: async () => {
        const res = await AxiosPublic.get(`/subject/${groupId}/`)
        return res.data.results
    },
    enabled: !!groupId
  })

  return {subjects, isLoading}
}
