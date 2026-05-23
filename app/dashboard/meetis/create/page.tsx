import { requiereAuth } from "@/lib/auth-server"
import Heading from "@/shared/components/typography/Heading"
import { generatePageTitle } from "@/shared/utils/metadata"
import CreateMeeti from "@/src/features/meetis/components/CreateMeeti"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

const title = 'Crear Meeti'
export const metadata : Metadata = {
    title: generatePageTitle(title)
}

export default async function CreateMeetiPage() {

  const { session } = await requiereAuth()
  if(!session) redirect('/auth/login')

  return (
    <>
        <Heading className="bg-linear-to-r mb-10 from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">{title}</Heading>

        <Link
            href="/dashboard/meetis" 
            className="mt-5 block lg:inline-block text-center bg-orange-500 hover:bg-orange-600 transition-colors text-xs lg:text-xl text-white py-3 px-10  font-bold rounded-full"
        >Volver a mis Meetis</Link>

        <CreateMeeti />
    </>
  )
}
