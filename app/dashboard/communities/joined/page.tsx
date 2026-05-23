import { requiereAuth } from "@/lib/auth-server"
import Heading from "@/shared/components/typography/Heading"
import { generatePageTitle } from "@/shared/utils/metadata"
import CommunityItem from "@/src/features/communities/components/CommunityItem"
import { membershipService } from "@/src/features/communities/services/MembershipService"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata : Metadata = {
    title: generatePageTitle('Comunidades a las que te uniste')
}

export default async function JoinedCommunitiesPage() {
  const { session } = await requiereAuth()
  if(!session) redirect('/auth/login')
    
  const communities = await membershipService.getJoinedCommunities(session.user)

  return (
    <>
        <Heading className="mb-10 bg-linear-to-r from-cyan-600 to-cyan-800 text-center bg-clip-text text-transparent">Comunidades a las que te uniste</Heading>
            <Link
                href="/dashboard/communities" 
                className="mt-5 block lg:inline-block text-center bg-cyan-600 hover:bg-cyan-700 transition-colors text-xs lg:text-xl text-white py-2 px-5  font-bold rounded-full"
            >Volver a mis Comunidades</Link>
        {communities.length ? (
          <ul role="list" className="divide-y divide-gray-100 mt-10 shadow-lg p-10">
            {communities.map(community => (
              <CommunityItem key={community.data.id} community={community} />
            ))}
          </ul>
        ) : (
          <p className="text-center mt-10 text-lg">No te has unido a una comunidad aún</p>
        )}
    </>
  )
}
