import { create } from "zustand";

export interface Iuser{
  id: string;
  email: string;
  name: string;
   icon: {
    url: string
    publicId: string
  } | null
  role: string;
}

interface storeAuthI {
  accessToken:string
  user:Iuser | null
  setAccessToken:(token:string) => void
  setUser:(data:Iuser) => void
  clear:() => void
}


export const useStoreAuth = create<storeAuthI>((set,get) => ({
  accessToken: "",
  user: null,

  setAccessToken: (token) =>
    set({ accessToken: token }),

  setUser: (data) =>
    set({user:data}),
  
    clear: () => 
      set(() => ({
        accessToken:"",
        user:null
    }))
}))