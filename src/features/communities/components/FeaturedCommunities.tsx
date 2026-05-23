import Heading from "@/shared/components/typography/Heading"
import { communityService } from "../services/CommunityService"
import CommunityCard from "./CommunityCard"


export default async function FeaturedCommunities() {
    const communities = await communityService.getFeaturedCommunities()

  return (
    <section className="bg-slate-100 py-16">
        <Heading level={2} className="bg-linear-to-r from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">Comunidades Destacadas</Heading>
        {communities.length ? (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10">
                {communities.map(community => <CommunityCard key={community.id} community={community} /> )}
            </div>
        ) : (
            <p className="text-center mt-10 text-lg text-gray-600">
                No hay comunidades destacadas
            </p>
        )}
    </section>
  )
}
