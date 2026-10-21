import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { db } from '../db'
import { AuthEmailService } from '../emails/services/AuthEmailService'

export const auth = betterAuth({
    trustedOrigins: [process.env.APP_URL || 'http://localhost:3000'],
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url}) => {
            const { name, email } = user
           await AuthEmailService.sendPasswordResetToken({name, email, url})
        }
    },
    emailVerification: {
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({user, url}) => {
            const {name, email} = user
            try {
                await AuthEmailService.sendVerificationEmail({name, email, url})
                console.log(`[auth] Verification email sent to ${email}`)
            } catch (error) {
                console.error(`[auth] Failed to send verification email to ${email}:`, error)
                throw error
            }
        }
    },
    user: {
        additionalFields: {
            bio: {
                type: 'string',
                required: false,
            },
        },
    },
    plugins: [nextCookies()]
})

