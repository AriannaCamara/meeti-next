import { requiereAuth } from "@/lib/auth-server"
import Heading from "@/shared/components/typography/Heading"
import { generatePageTitle } from "@/shared/utils/metadata"
import ActiveSessionsList from "@/src/features/auth/components/ActiveSessionsList"
import ChangePasswordForm from "@/src/features/auth/components/ChangePasswordForm"
import { Metadata } from "next"
import { redirect } from "next/navigation"


const title = 'Ajustes y Seguiridad'
export const metadata : Metadata = {
    title: generatePageTitle(title)
}

export default async function SecurityPage() {
    const { session } = await requiereAuth()
    if(!session) redirect('/auth/login')

  return (
    <>
        <Heading className="bg-linear-to-r mb-10 from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">{title}</Heading> 
        <ChangePasswordForm />
        <ActiveSessionsList />
    </>
  )
}
