import RegisterForm from "@/src/features/auth/components/RegisterForm";
import Heading from "@/src/shared/components/typography/Heading";
import { generatePageTitle } from "@/src/shared/utils/metadata";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: generatePageTitle('Crear Cuenta')
}

export default function RegisterPage() {
  return (
    <>
      <Heading className="bg-linear-to-r from-pink-500 to-rose-500 text-center bg-clip-text text-transparent">Crear Cuenta</Heading>

      <RegisterForm />

      <nav className="mt-15 flex justify-between">
        <Link
          href={'/auth/login'}
          className="text-cyan-700"
        >Iniciar Sesión</Link>

        <Link
          href={'/auth/forgot-password'}
          className="text-cyan-700"
        >Olvidaste Tu Password</Link>
      </nav>
    </>
  )
}