// import { api } from "@/lib/api"
// import { useStoreAuth } from "@/store/useStoreAuth"

// const setAccessToken = useStoreAuth((s) => s.setAccessToken)
// const setUser = useStoreAuth((s) => s.setUser)

// export const registerUser = async (email: string, password: string, name: string) => {
//     const { data } = await api.post("/register", { email, password, name })
//     return data 
// }

// export const loginUser = async (email: string, password: string) => {
//     const { data } = await api.post("/login", { email, password })
//     setAccessToken(data.accessToken)
//     setUser(data.user)
//     return data.user
// }


import { api } from "@/lib/api"


export const registerUser = async (email: string, password: string, name: string) => {
    const { data } = await api.post("/register", { email, password, name })
    return data 
}

export const loginUser = async (email: string, password: string) => {
    const { data } = await api.post("/login", { email, password })
    return data
}

export const Logout = async () => {
    const data = await api.post("/logout")
    return data
}

export const ForgetPassword = async (email:string) => {
    const data = await api.post('/forget-password',{email})
    return data
}

export const ResetPassword = async (token:string,newPassword:string,confirmPassword:string) => {
    const data = await api.post('/reset-password',{token,newPassword,confirmPassword})
    return data
}

