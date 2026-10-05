import { api } from "@/lib/api"


export const Getprofile = async () => {
    const data  = await api.get("/user/profile")
    return data
}

// export const UpdateProfile = async (
//   name: string,
//   email: string,
//   image?: File | null
// ) => {

//   const formData = new FormData()

//   formData.append("name", name)
//   formData.append("email", email)

//   if (image) {
//     formData.append("icon", image)
//   }

//   const { data } = await api.put(
//     "/user/update",
//     formData
//   )

//   return data
// }

export const UpdateProfile = async (
  name?: string,
  email?: string,
  image?: File | null
) => {
  const formData = new FormData()

  if (name !== undefined) {
    formData.append("name", name)
  }

  if (email !== undefined) {
    formData.append("email", email)
  }

  if (image) {
    formData.append("icon", image)
  }

  const { data } = await api.put(
    "/user/update",
    formData
  )

  return data
}

export const UpdatePassword = async (oldPassword:any,newPassword:any,configPassword:any) => {
  const data = await api.put("/user/update-password",{ 
        oldpassword: oldPassword,
        newpassword: newPassword,
        confirmNewPassword: configPassword
    })
  return data
}