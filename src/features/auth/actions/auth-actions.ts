"use server"

import { rateLimit } from "@/lib/limiter"
import { ChangePasswordInput, ChangePasswordSchema, ForgotPasswordInput, ForgotPasswordSchema, SetPasswordInput, SetPasswordSchema, SignInInput, SignInSchema, SignUpInput, SignUpSchema } from "../schemas/authSchema"
import { authService } from "../services/AuthService"
import { getClientIp } from "@/shared/utils/ip"
import { getMinutesDiffFromNow } from "@/shared/utils/date"
import { requiereAuth } from "@/lib/auth-server"
import { success } from "zod"

export async function signUpAction(input : SignUpInput) {
    const ip = await getClientIp()
    const {success, reset} = await rateLimit.limit(ip)

    if(!success) {
        return {
            error: `Limite Alcanzado. Intente de nuevo en ${getMinutesDiffFromNow(reset)} minutos`,
            succes: ''
        }
    }

    const data = SignUpSchema.safeParse(input)

    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }
    const response = await authService.register(data.data)
    return response
}

export async function signInAction(input: SignInInput) {
    const ip = await getClientIp()
    const {success, reset} = await rateLimit.limit(ip)

    if(!success) {
        return {
            error: `Limite Alcanzado. Intente de nuevo en ${getMinutesDiffFromNow(reset)} minutos`,
            succes: ''
        }
    }

    const data = SignInSchema.safeParse(input)
    if(!data.success) {
        return {
            error:'Hubo un error',
            success: ''
        }
    }
    const response = await authService.login(data.data)
    return response
}

export async function forgotPasswordAction(input: ForgotPasswordInput) {

    const ip = await getClientIp()
    const {success, reset} = await rateLimit.limit(ip)

    if(!success) {
        return {
            error: `Limite Alcanzado. Intente de nuevo en ${getMinutesDiffFromNow(reset)} minutos`,
            succes: ''
        }
    }

    const data = ForgotPasswordSchema.safeParse(input)
    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }
    const response = await authService.requestPasswordReset(data.data)
    return response
}

export async function setPasswordAction(input: SetPasswordInput, token: string) {
    const data = SetPasswordSchema.safeParse(input)
    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }
    const response = await authService.confirmPasswordReset(data.data, token)
    return response
}

export async function changePasswordAction(input: ChangePasswordInput) {
    const { session } = await requiereAuth()
    const data = ChangePasswordSchema.safeParse(input)
    if(!session || !data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }
    const result = await authService.changePassword(data.data)
    return result
}


