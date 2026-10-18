import { sql } from 'drizzle-orm'
import { db } from '../db'
import { rateLimits } from '../db/schema'

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 3
const OUTDATED_MS = 60 * 60 * 1000

type RateLimitResult = {
    success: boolean
    reset: number
}

// Ventana fija por identificador (IP): el upsert es atómico, así que
// concurrencia y varias instancias de servidor comparten el mismo conteo.
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
    const windowStart = new Date(Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS)

    try {
        const [row] = await db
            .insert(rateLimits)
            .values({ identifier, windowStart, count: 1 })
            .onConflictDoUpdate({
                target: rateLimits.identifier,
                set: {
                    count: sql`case when ${rateLimits.windowStart} < ${windowStart} then 1 else ${rateLimits.count} + 1 end`,
                    windowStart: sql`case when ${rateLimits.windowStart} < ${windowStart} then ${windowStart} else ${rateLimits.windowStart} end`
                }
            })
            .returning({
                count: rateLimits.count,
                windowStart: rateLimits.windowStart
            })

        return {
            success: row.count <= MAX_ATTEMPTS,
            reset: row.windowStart.getTime() + WINDOW_MS
        }
    } catch (error) {
        // Sin rate limit antes que romper login, registro u otra acción
        console.error('[rateLimit] No se pudo consultar la base de datos:', error)
        return { success: true, reset: Date.now() }
    }
}

// Evita que la tabla crezca sin control con IPs que ya no vuelven a entrar
async function cleanOutdatedWindows() {
    try {
        await db
            .delete(rateLimits)
            .where(sql`${rateLimits.windowStart} < ${new Date(Date.now() - OUTDATED_MS)}`)
    } catch (error) {
        console.error('[rateLimit] No se pudieron limpiar ventanas vencidas:', error)
    }
}

setInterval(cleanOutdatedWindows, OUTDATED_MS).unref()
