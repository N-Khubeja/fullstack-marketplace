// "use client"

// import { UpdatePassword } from "@/services/userService"
// import { useState } from "react"

// export default function PasswordUpdate() {
//     const [loading,setLoading] = useState(false)
//     const [oldPassword,setOldPassword] = useState("")
//     const [newPassword,setNewPassword] = useState("")
//     const [configPassword,setConfigPassword] = useState("")
//     const [result,setResult] = useState<string>("")

//     const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
//         e.preventDefault()
//         setLoading(true)
//         try {
//             const data = await  UpdatePassword(oldPassword,newPassword,configPassword)
//             console.log(data)
//         } catch (error) {
//             setResult("cant update password")
//         } finally {
//             setLoading(false)
//             setOldPassword("")
//             setNewPassword("")
//             setConfigPassword("")
//         }

//     }

//   return (
//     <form onSubmit={handleSubmit}>
//         <input onChange={(e) => setOldPassword(e.target.value)} type="password" placeholder="Old password" />
//         <input onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password"/>
//         <input onChange={(e) => setConfigPassword(e.target.value)} type="password" placeholder="Confirm password"/>
//         <button type="submit">{loading ?  <span className="spinner"></span> : "Change"}</button>
//         {result && <p>{result}</p>}
//     </form>
//   )
// }


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
