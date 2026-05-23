import { Suspense } from "react"
import Heading from "@/components/typography/Heading"
import SetPasswordForm from "@/src/features/auth/components/SetPasswordForm"
import { generatePageTitle } from "@/src/shared/utils/metadata"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: generatePageTitle('Reestablecer Password')
}

function PageContent() {
    return (
        <>
            <Heading className="bg-linear-to-r from-pink-500 to-rose-500 text-center bg-clip-text text-transparent">
                Definir Nuevo Password
            </Heading>

            <SetPasswordForm />

            <nav className="mt-15 flex justify-between">
                <Link href="/auth/login" className="text-cyan-700">
                    Iniciar Sesión
                </Link>

                <Link href="/auth/create-account" className="text-cyan-700">
                    Crear Cuenta
                </Link>
            </nav>
        </>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <PageContent />
        </Suspense>
    )
}