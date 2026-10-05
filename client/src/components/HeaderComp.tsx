"use client"

import { useStoreAuth } from "@/store/useStoreAuth"
import Link from "next/link"
import UserIcon from "./UserIcon"


export default function HeaderComp() {
const user = useStoreAuth((s) => s.user)

  return (
    <div className="header-comp">
        {user ? (
            <UserIcon user={user}/>
        ) : (
            <div className="header-comp-btns">
                <Link className="header-nav-link" href={'/login'}>LOGIN</Link>
                <Link className="header-nav-link" href={'/register'}>REGISTER</Link>
            </div>
        )}
    </div>
  )
}
