"use client"

import {  UpdateProfile } from "@/services/userService"
import { useStoreAuth } from "@/store/useStoreAuth"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import Image from "next/image"
import {  useState } from "react"
import { profileSchema, ProfileSchema } from "@/lib/schemas/userSchemas"

export const ProfileComponent = () => {
    const [image, setImage] = useState<File | null>(null)
    const [serverError, setServerError] = useState("")

    const setUser = useStoreAuth((s) => s.setUser)
    const user = useStoreAuth((s) => s.user)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting ,isDirty}
    } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
    })

    const onSubmit = async (data: ProfileSchema) => {
        try {
            setServerError("")

            const changedName =
                data.name !== user?.name
                    ? data.name
                    : undefined

            const changedEmail =
                data.email !== user?.email
                    ? data.email
                    : undefined

            const hasChanges =
                changedName ||
                changedEmail ||
                image

            if (!hasChanges) {
                return
            }

            const updated = await UpdateProfile(
                changedName,
                changedEmail,
                image
            )

            setUser(updated.user)

            reset({
                name: updated.user.name,
                email: updated.user.email
            })

            setImage(null)

        } catch (error: any) {
            setServerError(
                error.response?.data?.message ||
                "Update failed"
            )
        }
    }


    if (!user) {
        return null
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        {user.icon?.url ? (
        <Image
            src={user.icon.url}
            alt={`${user.name} profile image`}
            width={50}
            className="profile-form-img"
            height={50}
        />
        ) : (
        <h2>{user.name?.[0]?.toUpperCase()}</h2>
        )}

            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        setImage(e.target.files[0])
                    }
                }}
                 className="image-input"
            />

            <div className="profile-form-div">
                <input
                    type="text"
                    placeholder="Name"
                    {...register("name")}
                />
                
                {errors.name && (
                    <p>{errors.name.message}</p>
                )}
            </div>

            <div>
                <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                />
                {errors.email && (
                    <p>{errors.email.message}</p>
                )}
            </div>

            <input
                type="text"
                readOnly
                className="role-input"
                value={user?.role}
            />

            <button style={{cursor:"pointer"}} type="submit" disabled={isSubmitting || (!isDirty && !image)}>
                {isSubmitting
                    ? <span className="spinner"></span>
                    : "Update"}
            </button>

            {serverError && (
                <p>{serverError}</p>
            )}
        </form>
    )
}