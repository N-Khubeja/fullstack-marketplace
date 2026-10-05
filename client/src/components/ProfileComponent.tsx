// "use client"

// import { Getprofile, UpdateProfile } from "@/services/userService"
// import { useStoreAuth } from "@/store/useStoreAuth"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"

// import Image from "next/image"
// import { useEffect, useState } from "react"
// import { profileSchema, ProfileSchema } from "@/lib/schemas/userSchemas"

// type User = {
//   id: string
//   email: string
//   name: string
//   role: string
//     icon: {
//     url: string
//     publicId: string
//   } | null
// }

// export const ProfileComponent = () => {
//     const [userL, setUserL] = useState<User | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [image, setImage] = useState<File | null>(null)
//     const [serverError, setServerError] = useState("")

//     const setUser = useStoreAuth((s) => s.setUser)

//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors, isSubmitting ,isDirty}
//     } = useForm<ProfileSchema>({
//         resolver: zodResolver(profileSchema)
//     })

//     useEffect(() => {
//         const init = async () => {
//             try {
//                 const result = await Getprofile()

//                 setUserL(result.data)
//                 setUser(result.data)

//                 reset({
//                     name: result.data.name,
//                     email: result.data.email
//                 })

//             } catch (error) {
//                 console.log(error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         init()
//     }, [reset, setUser])

//     const onSubmit = async (data: ProfileSchema) => {
//         try {
//             setServerError("")

//             const changedName =
//                 data.name !== userL?.name
//                     ? data.name
//                     : undefined

//             const changedEmail =
//                 data.email !== userL?.email
//                     ? data.email
//                     : undefined

//             const hasChanges =
//                 changedName ||
//                 changedEmail ||
//                 image

//             if (!hasChanges) {
//                 return
//             }

//             const updated = await UpdateProfile(
//                 changedName,
//                 changedEmail,
//                 image
//             )

//             setUserL(updated.user)
//             setUser(updated.user)

//             reset({
//                 name: updated.user.name,
//                 email: updated.user.email
//             })

//             setImage(null)

//         } catch (error: any) {
//             setServerError(
//                 error.response?.data?.message ||
//                 "Update failed"
//             )
//         }
//     }

//     if (loading) {
//         return <span className="spinner"></span>
//     }

//     return (
//         <form onSubmit={handleSubmit(onSubmit)}>

//             {/* {!userL?.icon.url ? (
//                 <p>
//                     {userL?.name[0].toUpperCase()}
//                 </p>
//             ) : (
//                 <Image
//                     src={userL.icon.url}
//                     alt="user-image"
//                     width={50}
//                     height={50}
//                 />
//             )} */}

//             {userL?.icon === null ? (
//                 <p>
//                     {userL?.name[0].toUpperCase()}
//                 </p>
//             ) : (
//                 <Image
//                     src={userL!.icon!.url}
//                     alt="user-image"
//                     width={50}
//                     height={50}
//                 />
//             )}

//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                     if (e.target.files?.[0]) {
//                         setImage(e.target.files[0])
//                     }
//                 }}
//             />

//             <div>
//                 <input
//                     type="text"
//                     placeholder="Name"
//                     {...register("name")}
//                 />
//                 {errors.name && (
//                     <p>{errors.name.message}</p>
//                 )}
//             </div>

//             <div>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     {...register("email")}
//                 />
//                 {errors.email && (
//                     <p>{errors.email.message}</p>
//                 )}
//             </div>

//             <input
//                 type="text"
//                 readOnly
//                 value={userL?.role}
//             />

//             <button style={{cursor:"pointer"}} type="submit" disabled={isSubmitting || (!isDirty && !image)}>
//                 {isSubmitting
//                     ? <span className="spinner"></span>
//                     : "Update"}
//             </button>

//             {serverError && (
//                 <p>{serverError}</p>
//             )}
//         </form>
//     )
// }













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