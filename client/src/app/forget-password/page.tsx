// "use client"

// import { forgetPasswordSchema, ForgetPasswordSchema } from "@/lib/schemas/authSchemas"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"

// export default function paget() {

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting }
//   } = useForm<ForgetPasswordSchema>({
//     resolver:zodResolver(forgetPasswordSchema)
//   })

//   const onSubmit = async () => {
//     /// api call
//   }

//   return (
//     <div>
//       <h1>Forget password ?</h1>

//       <label htmlFor="">Enter your Email</label>
//       <input {...register("email")} type="email" name="email" placeholder="Enter your Email"/>
//       {errors.email && <p>{errors.email.message}</p>}
//       <button onClick={handleSubmit(onSubmit)}>Submit</button>
//     </div>
//   )
// }



"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  ForgetPasswordSchema,
  forgetPasswordSchema,
} from "@/lib/schemas/authSchemas"
import { ForgetPassword } from "@/services/authService"
import { useState } from "react"

export default function ForgotPasswordPage() {

  const [result,setResult] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
    reset
  } = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgetPasswordSchema) => {
    const res = await ForgetPassword(data.email)
    setResult(res.data.message)
    reset()
    
  }

  return (
    <>
    {result && <h1>{result}</h1>}
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Forgot password?</h1>

      <label htmlFor="email">
        Enter your email
      </label>

      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        {...register("email")}
      />

      {errors.email && (
        <p>{errors.email.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>

      
    </form>
    </>
  )
}