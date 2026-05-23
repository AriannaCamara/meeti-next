import Heading from "@/shared/components/typography/Heading"
import { generatePageTitle } from "@/shared/utils/metadata"
import DeleteCommunityModal from "@/src/features/communities/components/DeleteCommunityModal"
import MyCommunities from "@/src/features/communities/components/MyCommunities"
import { Metadata } from "next"
import Link from "next/link"

export const metadata : Metadata = {
    title: generatePageTitle('Administra tus comunidades')
}

export default function CommunitiesPage() {
  return (
    <>
        <Heading className="mb-10 bg-linear-to-r from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">Administra Tus Comunidades</Heading>
            <div className="flex justify-between flex-col lg:flex-row">
            <Link
                href="/dashboard/communities/create" 
                className="mt-5 block lg:inline-block text-center bg-cyan-600 hover:bg-cyan-800 transition-colors text-xs lg:text-xl text-white py-3 px-10  font-bold rounded-full"
            >Crear Comunidad</Link>
            <Link 
                href="/dashboard/communities/joined" 
                className="mt-5 block lg:inline-block text-center bg-cyan-600 hover:bg-cyan-800 transition-colors text-xs lg:text-xl text-white py-3 px-10  font-bold rounded-full"
            >Comunidades a las que te uniste</Link>
            </div>

            <MyCommunities />

            <DeleteCommunityModal />
    </>
  )
}
 