import Heading from "@/shared/components/typography/Heading";
import Image from "next/image";
import { User } from "../../auth/types/auth.types";
import Link from "next/link";

type Props = {
    organizer: User
}

export default function OrganizerCard({organizer}: Props) {

    const {image, name, id, bio} = organizer

  return (
    <>
      <Heading level={2} className="font-black  mt-5 uppercase bg-linear-to-r mb-10 from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">Organizador</Heading>
      <div className="grid grid-cols-4 items-center gap-3 mt-5">
        <div className="relative mx-auto aspect-square overflow-hidden rounded-full border border-gray-200 bg-white flex items-center justify-center">
            <Image
                src={image ? image : '/default.jpg'}
                alt="Imagen Perfil"
                width={300}
                height={300}
                className="object-cover"
            />
        </div>
        <div className="col-span-3 space-y-3">
          <p className="text-lg font-black">{name}</p>
          <p className="text-gray-500 text-sm">{bio}</p>
          <Link
            href={`/profiles/${id}`}
            className="font-bold text-sm bg-pink-600 p-2  text-white block w-full text-center bg-linear-to-r from-pink-500 to-rose-500 shadow-md hover:shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 rounded-full "
          >Ver Perfil</Link>
        </div>
      </div>
    </>
  )
}