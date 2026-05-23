import { requiereAuth } from "@/lib/auth-server";
import Heading from "@/shared/components/typography/Heading";
import { generatePageTitle } from "@/shared/utils/metadata";
import EditMeeti from "@/src/features/meetis/components/EditMeeti";
import { meetiService } from "@/src/features/meetis/services/MeetiService";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata({params} : PageProps<'/dashboard/communities/[id]/edit'>) : Promise<Metadata> {
    const { id } = await params
    const meeti = await meetiService.getMeetiById(id)
    return {
        title: generatePageTitle(`Editar Meeti: ${meeti.title}`)
    }
}

export default async function EditMeetiPage(props: PageProps<'/dashboard/meetis/[id]/edit'>) {
    const { session } = await requiereAuth();
    if(!session) redirect('/auth/login')

    const { id } = await props.params
    const meeti = await meetiService.getMeetiWithPermissions(id, session.user)
    if(!meeti.context.isAdmin) throw new Error('No Autorizado')

    return (
        <>
            <Heading className="font-black uppercase text-4xl bg-linear-to-r mb-10 from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">Editar Meeti: {meeti.data.title}</Heading>
        
            <Link
                        href="/dashboard/meetis" 
                        className="mt-5 block lg:inline-block text-center bg-orange-500 hover:bg-orange-600 transition-colors text-xs lg:text-xl text-white py-3 px-10  font-bold rounded-full"
                    >Volver a mis Meetis</Link>

            <EditMeeti 
                meeti={meeti.data}
            />
        </>
    )
}

