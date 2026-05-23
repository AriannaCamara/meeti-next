import Link from "next/link";
import AILink from "./AILink";

export default function GuestNavigation() {
  return (
    <nav className="flex justify-center items-center gap-4 mt-5 md:mt-0">
      <AILink />
      
      <Link 
        className="font-semibold text-lg text-cyan-700 hover:text-pink-600 transition-colors"
        href="/auth/login"
      >
        Iniciar Sesión
      </Link>

      <Link
        href="/auth/create-account"
        className="text-lg font-semibold text-white px-5 py-2 rounded-full 
        bg-linear-to-r from-pink-500 to-rose-500 
        shadow-md hover:shadow-lg 
        hover:from-pink-600 hover:to-rose-600
        transition-all duration-300"
      >
        Registrarse
      </Link>

    </nav>
  );
}