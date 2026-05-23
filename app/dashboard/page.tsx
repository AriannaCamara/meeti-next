import { requiereAuth } from "@/src/lib/auth-server";
import Heading from "@/src/shared/components/typography/Heading";
import { redirect } from "next/navigation";


export default async function DashboardPage() {

  const {isAuth} = await requiereAuth()
  if(!isAuth) redirect('/auth/login')
  return (
    <div>
      <>
        <Heading className="bg-linear-to-r from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">Panel de Administracion</Heading>
      </>
    </div>
  )
}
