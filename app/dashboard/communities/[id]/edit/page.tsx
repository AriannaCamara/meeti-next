import { requiereAuth } from "@/lib/auth-server";
import Heading from "@/shared/components/typography/Heading";
import { generatePageTitle } from "@/shared/utils/metadata";
import EditCommunity from "@/src/features/communities/components/EditCommunity";
import { communityService } from "@/src/features/communities/services/CommunityService";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata(
    props: PageProps<'/dashboard/communities/[id]/edit'>
): Promise<Metadata> {
    const { id } = await props.params 
    const result = await communityService.getCommunity(id)
    return {
        title: generatePageTitle(`Editar Comunidad: ${result.name}`)
    }
}

export default async function EditCommunityPage(props: PageProps<'/dashboard/communities/[id]/edit'>) {
    const {session} =  await requiereAuth()
    if(!session) redirect('/auth/login')

    const { id } = await props.params
    const community = await communityService.getCommunityDetails(id, session.user)
    if(!community.permissions?.canEdit) redirect('/dashboard/communities')

    return (
    <>
        <Heading className="mb-10 bg-linear-to-r from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">Editar Comunidad: <span className="text-orange-500">{community.data.name}</span> </Heading>
        
        <Link
            href="/dashboard/communities" 
            className="mt-5 block lg:inline-block text-center bg-cyan-600 hover:bg-cyan-700 transition-colors text-xs lg:text-xl text-white py-3 px-10  font-bold rounded-full"
        >Volver a mis Comunidades</Link>
        
        <EditCommunity 
            community={community.data}
        />
    </>
  )
}


 