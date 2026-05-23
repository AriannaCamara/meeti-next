"use client"

import { useState } from "react"
import { MeetiPermissions } from "../types/meeti.types"
import { toggleAttendace } from "../actions/attendace-actions"
import { success } from "zod"
import toast from "react-hot-toast"

type Props = {
    meetiId: string
    permissions: MeetiPermissions
}

export default function AttendanceToggleButton({meetiId, permissions} : Props) {
    const [ canConfirm, setCanConfirm] = useState(permissions.canConfirm)
    const handleClick = async () => {
        const result = await toggleAttendace(meetiId, canConfirm)

        if(result?.error) {
            toast.error(result.error)
        }
        if(result?.success) {
            toast.success(result.success)
            setCanConfirm(result.newPermissions.canConfirm)
        }
    }

  return (
        <button
            className={`${canConfirm ? 'bg-orange-500' : 'bg-red-600'} text-sm p-2 lg:inline-block lg:text-xl  font-bold w-full lg:w-auto px-5 py-3 text-white cursor-pointer rounded-full`}
            onClick={handleClick}
        >{canConfirm ? 'Confirmar Asistencia' : 'Cancelar Asistencia'}</button>   
    )
}


 //