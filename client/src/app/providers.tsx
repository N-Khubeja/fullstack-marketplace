"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useStoreAuth } from "@/store/useStoreAuth"

export default function Providers({ children }: { children: React.ReactNode }) {

    const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
        try {
            const { data } = await api.post("/refresh")
            useStoreAuth.getState().setAccessToken(data.accessToken)
            useStoreAuth.getState().setUser(data.user)
            console.log("refresh")
        } catch {
            useStoreAuth.getState().clear()
        }finally {
      setLoading(false)
    }
    }
    init()
}, [])  

    if (loading) return null

    return <>{children}</>
}