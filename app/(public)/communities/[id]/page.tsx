import { getServerSession } from "@/lib/auth-server"
import Heading from "@/shared/components/typography/Heading"
import { generatePageTitle } from "@/shared/utils/metadata"
import { pluralize } from "@/shared/utils/string"
import CommunityActionsPanel from "@/src/features/communities/components/CommunityActionsPanel"
import UpcomingCommunityMeetis from "@/src/features/communities/components/UpcomingCommunityMeetis"
import { communityService } from "@/src/features/communities/services/CommunityService"
import OrganizerCard from "@/src/features/meetis/components/OrganizerCard"
import { Metadata } from "next"
import Image from "next/image"
import { cache } from "react"

const getCommunityDetailsCached = cache(async (id: string) => {
    const session = (await getServerSession())
    const community = await communityService.getCommunityDetails(id, session?.user)
    return community
})

export async function generateMetadata({params} : PageProps<'/communities/[id]'>) : Promise<Metadata> {
    const {id} = await params
    const community = await getCommunityDetailsCached(id)
    return {
        title: generatePageTitle(`Comunidad ${community.data.name}`)
    }
}

export default async  function CommunityPage(props: PageProps<'/communities/[id]'>) {
    const { id } = await props.params
    
    const community = await getCommunityDetailsCached(id)

    return (
        <>
            <main className="max-w-7xl mx-auto space-y-5 p-10 lg:p-0 mt-10">
                {/* Action Panel */}
                {community.permissions && (
                    <CommunityActionsPanel 
                    permissions={community.permissions}
                    communityId={community.data.id}
                />
                )}
                

                <div className="grid grid-cols-1 lg:grid-cols-3 lg:items-start mt-10">
                    <div className="lg:col-span-2 space-y-5">
                    <div className="relative size-64 mx-auto aspect-square overflow-hidden rounded-full">
                        <Image 
                            src={community.data.image}
                            alt={`Imagen de la comunidad ${community.data.name}`}
                            width={600}
                            height={600}
                            className="object-cover size-64"
                            priority
                        />
                    </div>
                        <Heading className="text-center bg-linear-to-r from-cyan-500 to-cyan-800 bg-clip-text text-transparent">{community.data.name}</Heading>
                        <p className="text-gray-600 text-center text-lg">{community.data.description}</p>
                        <p className="text-gray-600 text-center text-sm">{community.memberCount} {pluralize('Miembro', community.memberCount)}</p>
                    </div>
                    <div className="bg-slate-100 p-5 rounded-2xl">
                    
                        <OrganizerCard 
                            organizer={community.data.admin}
                        />

                    </div>
                </div>
                </main>
                
                <UpcomingCommunityMeetis communityId={id} />

        </>
    )
}
