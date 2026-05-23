import { requiereAuth } from "@/lib/auth-server"
import Heading from "@/shared/components/typography/Heading"
import { generatePageTitle } from "@/shared/utils/metadata"
import CreateCommunity from "@/src/features/communities/components/CreateCommunity"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata : Metadata = {
    title: generatePageTitle('Crear Comunidad')
}

export default async function CreateCommunityPage() {
    const {session} =  await requiereAuth()
    if(!session) redirect('/auth/login')

  return (
    <>
        <Heading className="mb-10 bg-linear-to-r from-cyan-600 to-cyan-800 text-center bg-clip-text text-transparent">Administra Tus Comunidades</Heading>
            <Link
                href="/dashboard/communities" 
                className="mt-5 block lg:inline-block text-center bg-cyan-600 hover:bg-cyan-700 transition-colors text-xs lg:text-xl text-white py-3 px-10  font-bold rounded-full"
            >Volver a mis Comunidades</Link>

        <CreateCommunity />
    </>
  )
}
