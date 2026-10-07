"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStoreAuth } from "@/store/useStoreAuth"

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const user = useStoreAuth((state) => state.user)

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return children
}