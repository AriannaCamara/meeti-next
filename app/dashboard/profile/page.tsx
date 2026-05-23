import { requiereAuth } from "@/lib/auth-server"
import Heading from "@/shared/components/typography/Heading"
import { generatePageTitle } from "@/shared/utils/metadata"
import ProfileForm from "@/src/features/profile/components/ProfileForm"
import { Metadata } from "next"
import { redirect } from "next/navigation"

const title = 'Administra tu Perfil'
export const metadata: Metadata = {
    title: generatePageTitle(title)
}

export default async function ProfilePage() {
    const { session } = await requiereAuth()
    if(!session) redirect('/auth/login')
        

  return (
    <>
        <Heading className="font-black uppercase text-3xl mt-5 bg-linear-to-r mb-10 from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">{title}</Heading>
        <ProfileForm 
            user={session.user}
        />
    </>
  )
}
