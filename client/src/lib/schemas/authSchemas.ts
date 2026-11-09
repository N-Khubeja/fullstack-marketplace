import {  z } from "zod"

export const loginSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email"),
    password: z.string()
        .min(1, "Password is required")
})

export const registerSchema = z.object({
    name: z.string()
        .min(2, "Minimum 2 characters")
        .max(50, "Maximum 50 characters"),
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email"),
    password: z.string()
    .min(8, "Minimum 8 characters")
    .refine(
        value => new TextEncoder().encode(value).length <= 72,
        "Password is too long"
    )
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number")
    .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain special character"
    )
})

export const forgetPasswordSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email"),
})

export const resetPasswordSchema = z.object({
   newPassword: z.string()
    .min(8, "Minimum 8 characters")
    .refine(
        value => new TextEncoder().encode(value).length <= 72,
        "Password is too long"
    )
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number")
    .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain special character"
    ),
    
        confirmPassword: z.string()
        .min(1, "Please confirm password")
        }).refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"]   
        })

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>
export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>