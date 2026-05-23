import { requiereAuth } from "@/lib/auth-server";
import Heading from "@/shared/components/typography/Heading";
import { displayDate } from "@/shared/utils/date";
import { generatePageTitle } from "@/shared/utils/metadata";
import AttendanceToggleButton from "@/src/features/meetis/components/AttendanceToggleButton";
import { DynamicMeetiLocation } from "@/src/features/meetis/components/DynamicMeetiLocation";
import OrganizerCard from "@/src/features/meetis/components/OrganizerCard";
import { meetiService } from "@/src/features/meetis/services/MeetiService";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({params}: PageProps<'/meetis/[id]'>) : Promise<Metadata> {
    const { id } = await params
    const meeti = await meetiService.getMeetiById(id)

    return {
        title: generatePageTitle(`${meeti.title}`),
        openGraph: {
            title: `Meeti: ${meeti.title}`,
            siteName: 'Meeti',
            images: [
                {
                    url: meeti.image,
                    width: 1000,
                    height: 600,
                    alt: `Image del Meeti: ${meeti.title}`
                }
            ],
            locale: 'es_ES',
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: `Meeti: ${meeti.title}`,
            description: `Únete a este Meeti`,
            images: [meeti.image]
        }
    }
}

export default async function MeetiPage(props: PageProps<'/meetis/[id]'>) {
    const { session } = await requiereAuth()
    const { id } = await props.params
    const meeti = await meetiService.getMeetiWithDetails(id, session?.user)
    
    if(meeti.context.isPasMeeti) throw new Error('Meeti No Disponible')
        
    const {virtual: isVirtual, location} = meeti.data
    
    return (
        <>
            <nav className="py-5 border-b border-gray-200 px-5 lg:px-0">
                <div className="max-w-7xl mx-auto flex flex-col gap-3  items-start lg:flex-row lg:justify-between lg:gap-0">
                    <p className=" text-gray-600">Categoría: {''}
                        <Link
                            href={`/categories/${meeti.data.category.id}`}
                            className="font-black"
                        >{meeti.data.category.name}</Link>
                    </p>
                    <p className=" text-gray-600">Comunidad: {''}
                        <Link
                            href={`/communities/${meeti.data.community.id}`}
                            className="font-black"
                        >{meeti.data.community.name}</Link>
                    </p>
                </div>
                </nav>  

                    {!session?.user && (
                        <p className="font-bold border border-orange-500 p-2 rounded-full">Confirma tu asistencia, obteniendo una cuenta. ¡ES GRATIS!</p>
                    )}
                    <div className="max-w-7xl mx-auto my-10 flex justify-end w-full">
                        {meeti.permissions && !meeti.context.isAdmin && (
                            <AttendanceToggleButton 
                                meetiId={meeti.data.id}
                                permissions={meeti.permissions}
                            />
                        )}
                    </div>
                

                <Heading className="font-black  mt-5 uppercase bg-linear-to-r mb-10 from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">{meeti.data.title}</Heading>

                <main className="max-w-7xl mx-auto grid grid-cols-1 gap-5 lg:grid-cols-3 p-5 lg:px-0 mt-10">
                <section className="lg:col-span-2">
                    <Image 
                        src={meeti.data.image}
                        alt={`Imagen de Meeti: ${meeti.data.title}`}
                        className="rounded-xl"
                        width={800}
                        height={600}
                        priority
                    />
                    <p className="mt-5 text-lg">{meeti.data.details}</p>
                </section>

                <aside className="bg-slate-100 rounded-2xl">
                    {isVirtual && (
                        <p className="bg-orange-400 m-5 rounded-lg text-center p-3 text-white font-bold">Este Meeti es Virtual</p>
                    )}

                    {location && !isVirtual && (
                        <DynamicMeetiLocation 
                            address={location.address}
                            lat={location.lat}
                            lng={location.lng}
                            placeName={location.placeName}
                        />
                    )}

                    <section className="space-y-5 p-10 ">
                        <Heading level={2} className="font-black  mt-5 uppercase bg-linear-to-r mb-10 from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">Información Meeti</Heading>
                        
                        <p>
                            <span className="font-bold">Fecha: </span> {''}
                            {displayDate(meeti.data.date)}
                        </p>
                        <p>
                            <span className="font-bold">Hora: </span> {''}
                            {meeti.data.time} Horas
                        </p>
                        
                        <OrganizerCard 
                            organizer={meeti.data.admin}
                        />
                    </section>
                </aside>
                </main>
        </>
    ) 
}