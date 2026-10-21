
"use client"

import { passwordchangechema, PasswordChangeSchema } from "@/lib/schemas/userSchemas"
import { UpdatePassword } from "@/services/userService"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function PasswordUpdate() {
    const [serverError,setServerError] = useState("")

    const {register,handleSubmit:onSubmit,formState: { errors, isSubmitting }} = useForm<PasswordChangeSchema>({resolver:zodResolver(passwordchangechema)})

    const handleSubmit = async (data:PasswordChangeSchema) => {
        try {
            const res = await  UpdatePassword(data.oldPassword,data.newPassword,data.configPassword)
            console.log(res)
        } catch (error:any) {
            setServerError(
                error.response?.data?.errors?.oldPassword ||
                error.response?.data?.errors?.newPassword ||
                error.response?.data?.errors?.configPassword ||
                "Login failed"
            )
        } finally {
            
        }

    }

  return (
    <form className="profile-form" onSubmit={onSubmit(handleSubmit)}>
        <div className="password-change-input">
        <input
            type="password"
            placeholder="Old password"
            {...register("oldPassword")}
        />
        {errors.oldPassword && <p>{errors.oldPassword.message}</p>}
        </div>

        <div className="password-change-input">
        <input
            type="password"
            placeholder="New password"
            {...register("newPassword")}
        />
        {errors.newPassword && <p>{errors.newPassword.message}</p>}
        </div>

        <div className="password-change-input">
        <input
            type="password"
            placeholder="Confirm password"
            {...register("configPassword")}
        />
        {errors.configPassword && <p>{errors.configPassword.message}</p>}
        </div>
        <button type="submit">{isSubmitting ?  <span className="spinner"></span> : "Change"}</button>
        {serverError && <p>{serverError}</p>}
    </form>
  )
}
