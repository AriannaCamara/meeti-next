import { auth } from "@/src/lib/auth"
import { ChangePasswordInput, ForgotPasswordInput, SetPasswordInput, SignInInput, SignUpInput } from "../schemas/authSchema"
import { authRepository, IAuthRepository } from "./AuthRepository"
import { headers } from "next/headers"
import { APIError, success } from "better-auth"
import { checkPassword } from "@/shared/utils/auth"

class AuthService {

    constructor(
        private authRepository : IAuthRepository
    ){}

    async register(credentials: SignUpInput) {
        const { name, email, password } = credentials
        // Revisar si el usuario existe
        const user = await this.authRepository.userExists(email)
        if(user) {
           return {
                error: 'Este e-mail ya esta registrado',
                success: ''
            } 
        }

        // Manajar el registro
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
                callbackURL: '/dashboard'
            },
            headers: await headers()
        })
        return {
            error: '',
            success: 'Cuenta creada correctamente, revisa tu e-mail'
        }
    }

    async login(credentials: SignInInput) {
        const { email, password } = credentials
        // Revisar si el usuario existe
        const user = await this.authRepository.userExists(email)
        if(!user) {
           return {
                error: 'El usuario no existe',
                success: ''
            } 
        }

        // verificar su password y si confirmo su cuenta
        try {
            await auth.api.signInEmail({
                body: {
                    email,
                    password,
                    callbackURL: '/dashboard'
                },
                headers: await headers()
            })
            return {
                error: '',
                success: 'Sesión iniciada correctamente'
            }
        } catch (error) {
            if(error instanceof APIError) {
                const messages : Record<number, string> = {
                    401: 'Password Incorrecto',
                    403: 'Tu cuenta no ha sido confirmada, revisa tu email'
                }
                const errorMessage = messages[error.statusCode]
                if(errorMessage) {
                    return {
                        error: errorMessage,
                        success: ''
                    } 
                }
            }
        }

        return {
                error: '',
                success: ''
            } 
    }

    async requestPasswordReset(input: ForgotPasswordInput) {
        const user = await this.authRepository.userExists(input.email)
        if(!user) {
            return {
                error: 'El usuario no existe',
                success: ''
            }
        }

        const { email } = input
        await auth.api.requestPasswordReset({
            body: {
                email
            }
        })

        return {
            error: '',
            success: 'Hemos enviado un email con instrucciones'
        }
    }

    async confirmPasswordReset(input: SetPasswordInput, token: string) {
        const { newPassword } = input
        try {
            await auth.api.resetPassword({
                body: {
                    newPassword,
                    token
                }
            })
            return {
                error: '',
                success: 'Password reestablecido correctamente'
            }
        } catch (error) {
            if(error instanceof APIError) {
                return {
                    error: 'Token no válido o expirado',
                    success: ''
                }
            }
        }
        return {
            error: '',
            success: ''
        }
    }

    async changePassword(input: ChangePasswordInput) {
        const {newPassword, currentPassword, revokeOtherSessions} = input
        const isValid = await checkPassword(currentPassword)
        if(!isValid) {
            return {
                error: 'El password actual es incorrecto',
                success: ''
            }
        }
        await auth.api.changePassword({
            body: {
                currentPassword,
                newPassword
            },
            headers: await headers()
        })

        if(revokeOtherSessions) {
            await auth.api.revokeOtherSessions({
                headers: await headers()
            })
        }

        return {
            error: '',
            success: 'El password se actualizo correctamente'
        }
    }

    async getSessions() {
        return auth.api.listSessions({
            headers: await headers()
        })
    }

    async getSession() {
        return auth.api.getSession({
            headers: await headers()
        })
    }
}

export const authService = new AuthService(authRepository)

