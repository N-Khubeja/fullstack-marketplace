// "use client"

// import { loginUser } from "@/services/authService"
// import { useStoreAuth } from "@/store/useStoreAuth"
// import { useRouter } from "next/navigation"
// import { useState } from "react"

// export default function LoginComptonent() {
//   const [email,setEmail] = useState<string>("")
//   const [password,setPassword] = useState<string>("")
//   const [error,setError] = useState<string>("")
//   const [loading,setLoading] = useState<boolean>(false)
//   const router = useRouter()


//   const setUser = useStoreAuth((s) => s.setUser)
//   const setAccessToken = useStoreAuth((s) => s.setAccessToken)

//   const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     setLoading(true)
//     try {
//       const data = await loginUser(email, password)
//       setAccessToken(data.accessToken)
//       setUser(data.user)
//       setLoading(false)
//       router.push('/')
//     } catch (error) {
//       setError("failed registration")
//       setLoading(false)
//     } finally{
//       setLoading(false)
//     }
//   }


//   return (
//     <form className="auth-form" onSubmit={submit}>
//       <input className="auth-input" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input className="auth-input" type="password"  placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button type="submit">{loading ?  <span className="spinner"></span> : "Submit"}</button>
//       {error && <p>{error}</p>}
//     </form>
//   )
// }





"use client"

import { loginUser } from "@/services/authService"
import { useStoreAuth } from "@/store/useStoreAuth"
import { loginSchema, LoginSchema } from "@/lib/schemas/authSchemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function LoginComponent() {
    const [serverError, setServerError] = useState("")
    const router = useRouter()
    const setUser = useStoreAuth((s) => s.setUser)
    const setAccessToken = useStoreAuth((s) => s.setAccessToken)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginSchema) => {
        setServerError("")
        try {
            const res = await loginUser(data.email, data.password)
            setAccessToken(res.accessToken)
            setUser(res.user)
            router.push("/")
        } catch (error: any) {
            setServerError(
                error.response?.data?.errors?.email ||
                error.response?.data?.errors?.password ||
                error.response?.data?.message ||
                "Login failed"
            )
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input
                    className="auth-input"
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                />
                {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div>
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                />
                {errors.password && <p>{errors.password.message}</p>}
            </div>

            <button type="submit">
                {isSubmitting ? <span className="spinner"></span> : "Submit"}
            </button>
            <Link href={'/forget-password'} >
                forget password ? 
            </Link>
            {serverError && <p>{serverError}</p>}
        </form>
    )
}