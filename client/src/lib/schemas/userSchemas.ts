import z from "zod";

// export const passwordchangechema = z.object({
//     oldPassword:z.string()
//     .min(1,"password is required"),
    
//     newPassword:z
//     .string()
//     .min(1, "oldPassword is required")
//     .min(8, "Minimum 8 characters")
//     .regex(/[A-Z]/, "Must contain uppercase letter")
//     .regex(/[0-9]/, "Must contain number"),

//     configPassword:z
//     .string()
//     .min(1, "oldPassword is required")
//     .min(8, "Minimum 8 characters")
//     .regex(/[A-Z]/, "Must contain uppercase letter")
//     .regex(/[0-9]/, "Must contain number"),

// })

export const passwordchangechema = z.object({
    oldPassword: z.string().min(1, "Password is required"),
    newPassword: z.string()
        .min(8, "Minimum 8 characters")
        .regex(/[A-Z]/, "Must contain uppercase")
        .regex(/[0-9]/, "Must contain number"),
    configPassword: z.string()
        .min(1, "Please confirm password")
}).refine((data) => data.newPassword === data.configPassword, {
    message: "Passwords do not match",
    path: ["configPassword"]  
})


export const profileSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Minimum 2 characters")
        .max(50, "Maximum 50 characters")
        .regex(/^[a-zA-Zა-ჰ\s'-]+$/, "Only letters allowed")
        .optional(),

    email: z.string()
        .email("Invalid email")
        .optional()
})

export type ProfileSchema = z.infer<typeof profileSchema>
export type  PasswordChangeSchema = z.infer<typeof passwordchangechema>

