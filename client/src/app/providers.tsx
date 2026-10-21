"use client"

import { useEffect, useState } from "react"
import { QueryClientProvider } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useStoreAuth } from "@/store/useStoreAuth"
import { getQueryClient } from "@/lib/react-query/get-query-client"

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)

  const queryClient = getQueryClient()

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await api.post("/refresh")

        useStoreAuth
          .getState()
          .setAccessToken(data.accessToken)

        useStoreAuth
          .getState()
          .setUser(data.user)
      } catch {
        useStoreAuth.getState().clear()
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  if (loading) return null

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}