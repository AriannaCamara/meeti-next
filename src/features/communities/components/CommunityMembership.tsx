"use client"

import { useState } from "react"
import { CommunityPermissions } from "../types/community.types"
import { toggleMembershipActions } from "../actions/membership-actions"
import toast from "react-hot-toast"

type Props = {
    permissions: CommunityPermissions
    communityId: string
}

export default function CommunityMembership({permissions, communityId} : Props) {
    const [canJoin, setCanJoin] = useState(permissions.canJoin)
    const [canLeave, setCanLeave] = useState(permissions.canLeave)

    const handleClick = async () => {
        const result = await toggleMembershipActions(communityId)
        if(result?.success) {
            toast.success(result.message)
            setCanJoin(result.newPermissions.canJoin)
            setCanLeave(result.newPermissions.canLeave)
        }
    }

  return (
    <>
        {canJoin && (
            <button
                className="font-bold text-xl w-full lg:w-auto px-5 py-3 text-white cursor-pointer bg-linear-to-r from-orange-400 to-orange-600 rounded-full"
                onClick={handleClick}
            >Inscribirme a esta comunidad</button>
        )}
        
        {canLeave && (
            <button
                className="font-bold text-lg w-full lg:w-auto px-5 py-2 text-white cursor-pointer bg-linear-to-r from-red-500 to-red-700 rounded-full"
                onClick={handleClick}
            >Abandonar esta comunidad</button>
        )}
        
    </>
  )
}
