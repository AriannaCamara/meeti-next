"use server"

import { requiereAuth } from "@/lib/auth-server"
import { meetiAttendeesServise } from "../services/MeetiAttendeesService"
import { getClientIp } from "@/shared/utils/ip"
import { rateLimit } from "@/lib/limiter"
import { getMinutesDiffFromNow } from "@/shared/utils/date"

export async function toggleAttendace(meetiId: string, canConfirm: boolean) {
    const ip = await getClientIp()
    const { success, limit, remaining, reset} = await rateLimit.limit(ip)
    
    if(!success) {
        return {
            error: `Limite Alcanzado. Intente de nuevo en ${getMinutesDiffFromNow(reset)} minutos`,
            success: '',
            newPermissions: {
                canConfirm,
                canCancel: !canConfirm
            }
        }
    }

    const { session } = await requiereAuth()
    if(!session) throw new Error('Usuario No Autenticado')

    const result = await meetiAttendeesServise.toggleAttendance(meetiId, session.user)
    return result
}