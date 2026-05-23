import Link from "next/link";
import AILink from "./AILink";


export default function UserNavigation() {
  return (
    <nav className="flex justify-center gap-5 items-center mt-5 md:mt-10 mb-6">
      <AILink />
        <Link
            href={'/dashboard'}
            className="font-bold text-sm bg-linear-to-r from-pink-500 to-rose-500 shadow-md hover:shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 p-2 lg:inline-block lg:text-xl py-3 px-5 rounded-full text-white block w-full text-center"
        >Panel de Administración</Link>
    </nav>
  )
}
