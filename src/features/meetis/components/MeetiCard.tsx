import Heading from "@/shared/components/typography/Heading";
import { SelectMeeti } from "../types/meeti.types";
import Image from "next/image";
import { displayDate } from "@/shared/utils/date";
import Link from "next/link";

type Props = {
    meeti: SelectMeeti
}

export default function MeetiCard({meeti}: Props) {
  return (
    <div className="border border-slate-200 hover:shadow-lg transition-shadow rounded-xl">
      <div className="overflow-hidden">
        <Image
            src={meeti.image}
            width={400}
            height={600}
            alt={`Imagen Meeti ${meeti.title}`}
            className="object-cover h-72 w-full transition-transform duration-300 ease-in-out hover:scale-120 rounded-t-xl"
        />
      </div>
      <div className="p-5 space-y-5">
        <p className="text-sm text-gray-600">
            {displayDate(meeti.date)}
        </p>
        <Heading level={3} className="text-2xl font-bold h:32 text-center text-cyan-700">
            {meeti.title}
        </Heading>
        <div className="flex items-center gap-5">
          <p className="line-clamp-3">
            {meeti.details}
          </p>
        </div>
        <Link
            href={`/meetis/${meeti.id}`}
            className="bg-orange-500 hover:bg-orange-600 transition-colors text-xl text-white py-3 px-10 mt-10 font-bold block text-center rounded-full"
        >
          Ver Meeti
        </Link>
      </div>
    </div>
  )
}

//font-bold text-lg w-full lg:w-auto px-5 py-2 text-white cursor-pointer bg-linear-to-r from-orange-400 to-orange-600 rounded-full