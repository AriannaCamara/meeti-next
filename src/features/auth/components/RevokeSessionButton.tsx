"use client"

import { revokeSession } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import toast from "react-hot-toast"

type Props = {
    token: string
}

export default function RevokeSessionButton({token}: Props) {
  return (
    <button
        className="bg-red-600 font-bold px-3 py-1 rounded-full text-white cursor-pointer"
        onClick={async () => {
            await revokeSession({token})
            toast.success('Se cerró la sesión correctamente')
            redirect('/dashboard/security')
        }}
    >Cerrar Sesión</button>
  )
}
