import Heading from "@/shared/components/typography/Heading";
import Link from "next/link";


export default function NotFound() {
  return (
    <div className="py-10 text-center">
        <Heading>Meeti No Disponible</Heading>
        <p className="mt-3 text-gray-600 dark:text-gray-300">Este meeti ya pasó o no existe.</p>
        <Link href={'/'} className="mt-3 block">Tal vez quieras ir al inicio</Link>
    </div>
  )
}
