"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Form, FormError, FormInput, FormLabel, FormSubmit } from "@/shared/components/forms"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SetPasswordInput, SetPasswordSchema } from "../schemas/authSchema"
import { setPasswordAction } from "../actions/auth-actions"
import toast from "react-hot-toast"

export default function SetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const t = searchParams.get("token")

        if (!t) {
            router.push("/auth/forgot-password")
        } else {
            setToken(t)
        }
    }, [searchParams, router])

    const { register, handleSubmit, formState: { errors } } =
        useForm<SetPasswordInput>({
            resolver: zodResolver(SetPasswordSchema),
            mode: "all"
        })

    const onSubmit = async (data: SetPasswordInput) => {
        if (!token) return

        const { error, success } = await setPasswordAction(data, token)

        if (error) toast.error(error)
        if (success) {
            toast.success(success)
            router.push("/auth/login")
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormLabel htmlFor="newPassword">Nuevo Password</FormLabel>

            <FormInput
                type="password"
                id="newPassword"
                {...register("newPassword")}
            />
            {errors.newPassword && <FormError>{errors.newPassword.message}</FormError>}

            <FormLabel htmlFor="passwordConfirmation">Repetir Password</FormLabel>

            <FormInput
                type="password"
                id="passwordConfirmation"
                {...register("passwordConfirmation")}
            />
            {errors.passwordConfirmation && <FormError>{errors.passwordConfirmation.message}</FormError>}

            <FormSubmit value="Reestablecer Password" />
        </Form>
    )
}