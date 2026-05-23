import Image from "next/image"
import { SelectCommunity } from "../types/community.types"
import Heading from "@/shared/components/typography/Heading"
import Link from "next/link"
import { pluralize } from "@/shared/utils/string"

type Props = {
    community: Omit<SelectCommunity, 'createdAt' | 'createdBy'> & {
      membersCount : string
    }
    target?: boolean
}

export default function CommunityCard({community, target = false}: Props) {
  return (
    <div className="mb-10 border border-slate-200 bg-white hover:shadow-lg transition-shadow rounded-xl">
      <div className="overflow-hidden">
        <Image
            src={community.image}
            alt={`Imagen de la comunidad ${community.name}`}
            width={800}
            height={600}
            priority
            className="object-cover h-60 w-full transition-transform duration-300 ease-in-out hover:scale-120 rounded-t-xl"
        />
      </div>
      <div className="p-5 space-y-3">
        <p className="line-clamp-3">{community.description}</p>
          {community.membersCount && <p className="text-gray-600 text-sm">{community.membersCount} {pluralize('Miembro', +community.membersCount)}</p>}
        <Heading level={3} className="font-bold text-2xl text-cyan-700 text-center line-clamp-1">{community.name}</Heading>
        <Link
            href={`/communities/${community.id}`}
            className="rounded-full bg-orange-500 hover:bg-orange-600 transition-colors text-xl text-white py-3 px-10 mt-10 font-bold block text-center"
            target={target ? '_blank' : ''}
        >
          Ver Comunidad
        </Link>
      </div>
    </div>
  )
}