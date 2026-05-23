import Link from "next/link"
import { CommunityPermissions } from "../types/community.types"
import CommunityMembership from "./CommunityMembership"

type Props = {
    permissions: CommunityPermissions
    communityId: string
}

export default function CommunityActionsPanel({permissions, communityId}: Props) {
  return (
    <div className="flex justify-end">
        {permissions.canEdit && (
            <Link
                href={`/dashboard/communities/${communityId}/edit`}
                className="font-bold text-sm p-2 lg:inline-block block lg:text-xl bg-linear-to-r from-orange-400 to-orange-600 px-5 py-2 text-white rounded-full"
                target="_blank"
            >Editar Comunidad</Link>
        )}
        {permissions.canJoin || permissions.canLeave ? (
            <CommunityMembership 
                permissions={permissions}
                communityId={communityId}
            />
        ) : null }
    </div>
  )
}
            

