

"use client"

import { registerSchema, RegisterSchema } from "@/lib/schemas/authSchemas"
import { registerUser } from "@/services/authService"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function RegisterComptonent() {
  const router = useRouter()
  const [serverError,setServerError] = useState("")

  const {register,handleSubmit,formState: { errors, isSubmitting }} = useForm<RegisterSchema>({resolver:zodResolver(registerSchema)})

  const submit = async (data:RegisterSchema) => {
    try {
      await registerUser(data.email,data.password,data.name)
      router.push('/login')
    } catch (error:any) {
      setServerError(
                error.response?.data?.errors?.email ||
                error.response?.data?.errors?.name ||
                error.response?.data?.errors?.password ||
                error.response?.data?.message ||
                "register failed"
      )
    } 
  }


  return (
    <form className="auth-form" onSubmit={handleSubmit(submit)}>
      <div>
        <input className="auth-input" type="text" placeholder="name" {...register("name")} />
        {errors.name && <p>{errors.name?.message}</p>}
      </div>

      <div>
        <input className="auth-input" type="email" placeholder="email"  {...register("email")} />
        {errors.email && <p>{errors.email?.message}</p>}
      </div>

      <div>
        <input className="auth-input" type="password" placeholder="password"  {...register("password")} />
        {errors.password && <p>{errors.password?.message}</p>}
      </div>

      <button className="auth-input" type="submit">{isSubmitting ?  <span className="spinner"></span> : "Submit"}</button>
      
      {serverError && <p>{serverError}</p>}
    </form>
  )
}
