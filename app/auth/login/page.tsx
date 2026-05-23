import LoginForm from "@/src/features/auth/components/LoginForm";
import Heading from "@/src/shared/components/typography/Heading";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: generatePageTitle('Iniciar Sesión')
}

export default function LoginPage() {
  return (
    <>
      <Heading className="text-4xl font-black uppercase 
               bg-linear-to-r from-pink-500 to-rose-500 
               bg-clip-text text-transparent"
              >Iniciar Sesión</Heading>
      <LoginForm />

      <nav className="mt-15 flex justify-between">
        <Link
          href={'/auth/create-account'}
          className="text-cyan-700"
        >Crear Cuenta</Link>

        <Link
          href={'/auth/forgot-password'}
          className="text-cyan-700"
        >Olvidaste Tu Password</Link>
      </nav>
    </>
  )
}

