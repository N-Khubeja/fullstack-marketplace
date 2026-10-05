"use client"

import { Logout } from "@/services/authService"
import { Iuser, useStoreAuth } from "@/store/useStoreAuth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {  useEffect, useRef, useState } from "react"

type Props = {
  user: Iuser
}

export default function UserIcon({user}:Props) {
    const clear = useStoreAuth((s) => s.clear)
    const router = useRouter()
    const [open,setOpen] = useState<boolean>(false)
    const refDiv = useRef<HTMLDivElement | null>(null)

    const submit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        await Logout()
        clear()
        router.push('/')
    }

 useEffect(() => {
    const click = (e: MouseEvent) => {
      if (refDiv.current && !refDiv.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

useEffect(() => {
   const click = (e:KeyboardEvent) => { 
    if(e.key === "Escape" && open){ 
      setOpen(false) 
    } 
  } 
  document.addEventListener("keydown",click) 
  return () => document.removeEventListener("keydown",click) 
},[open])



  return (
    <div className="user-icon" ref={refDiv}>
        {user?.icon === null ? (
                    <p onClick={() => setOpen(prev => !prev)}>{user.name[0].toUpperCase()}</p>
                    ): (
                    <Image
                        onClick={() => setOpen(prev => !prev)}
                        alt="user-image"
                        src={user.icon.url}
                        width={50}
                        height={50}
                        className="user-image"
                    />
          )}
        <div className={`user-nav ${open ? 'open' : ''}`}>
            <Link href={'/profile'} className="user-nav-btn">Profile</Link>
            <button className="user-nav-btn">security</button>
            <button className="user-nav-btn" onClick={submit}>Logout</button>
        </div>
    </div>
  )
}
