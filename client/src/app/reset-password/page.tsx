"use client"

import { api } from "@/lib/api"
import { ResetPasswordSchema, resetPasswordSchema } from "@/lib/schemas/authSchemas"
import { ResetPassword } from "@/services/authService"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { error } from "console"
import Link from "next/link"
import {  useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function page() {

    const [result,setResult] = useState<string>('')

    const params = useSearchParams()
    const token = params.get("token")
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ResetPasswordSchema>({
        resolver:zodResolver(resetPasswordSchema),
        defaultValues:{
            newPassword:"",
            confirmPassword:""
        }
    })

    // const onSubmit = async (data:ResetPasswordSchema) => {
    //    try {
    //     const res = await ResetPassword(token!,data.newPassword,data.confirmPassword)
    //      reset()
    //     setResult(res.data.message)
    //     console.log(res.data.message)
    //    } catch (error) {
    //     console.log(error)
    //    }
    // }


const onSubmit = async (data: ResetPasswordSchema) => {
  if (!token) {
    console.log("Token is missing")
    return
  }

  try {
    const res = await ResetPassword(
      token,
      data.newPassword,
      data.confirmPassword
    )

    reset()
    setResult(res.data.message)
     } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("STATUS:", error.response?.status)
      console.log("BACKEND DATA:", error.response?.data)
      return
    }

    console.log(error)
  }
}



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="">New Password</label>
        <input type="text" placeholder="new password" {...register("newPassword")}/>
        {errors.newPassword && <p>{errors.newPassword.message}</p>}

        <label htmlFor="">Confirm Password</label>
        <input type="text" placeholder="new password" {...register("confirmPassword")}/>
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

        <button disabled={isSubmitting} type="submit">Reset passowrd</button>

        {result && <h2>{result}</h2>}
        <Link href={'/login'}>LOG IN</Link>
    </form>
  )
}
