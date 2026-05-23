import { tool } from "ai";
import z from "zod";
import { meetiService } from "../../meetis/services/MeetiService";
import { meeti } from "@/src/db/schema";


export const meetiTools = {
    getMeetisBySubject: tool({
        description: 'Recomienda Meetis cuando el usuario busque o te pregunte un meeti sobre un tema en específico',
        inputSchema: z.object({
            query: z.string().describe('Tema de interés del Meeti')
        }),
        execute: async ({query}) => {
            const meetis = await meetiService.getMeetisByTopic(query)

            if(!meetis.length) {
                return {
                    meetis: [],
                    totalFound: 0,
                    message: `No encontré meetis relacionados con ${query} ¿Te gustaría intentar con otra búsquedad?`
                }
            }

            return {
                meetis,
                totalFound: meetis.length
            }
        }
    }),
    getVirtualMeetis: tool({
        description: `Usa esta herramienta cuando el usuario pregunta por meetis o eventos virtuales. 
            - Si menciona un tema (React, IA, MArketing, Bitcoin, Cafe, etc), pásalo al query.
            - Si menciona "hoy", incluyelo dentro del query.
            - Si el usuario solo pregunta sobre meetis virtuales, query debe ir vacio.
        `,
        inputSchema: z.object({
            query: z.string().optional().describe('Tema de interes del usuario sobre meeti o evento')
        }),
        execute: async({query}) => {
            const meetis = await meetiService.getVirtualMeetis(query)

            if(!meetis.length) {
                return {
                    meetis: [],
                    totalFound: 0,
                    message: `No encontré meetis relacionados con ${query} que sean virtuales ¿Te gustaría intentar con otra búsquedad?`
                }
            }

            return {
                meetis,
                totalFound: meetis.length
            }
        }
    }),
    getInPersonMeetis: tool({
        description: `
            Usa esta herramienta cuando el usuario pregunte por eventos presenciales.
            Reglas: 
                - Si el usuario menciona una ciudad, inclúyela en 'city'.
                - Si e usuario menciona un país, inclúyelo en 'country'.
                - Si menciona un tema (React, Bitcoin, MKT, IA, Café, etc), inclúyelo dentro de 'query'.
                - Si el usuario menciona hoy, pon en 'today' como true.
        `,
        inputSchema: z.object({
            query: z.string().optional().describe('Tema de interés del Meeti o evento del usuario'),
            city: z.string().optional().describe('Ciudad del Meeti de interés del usuario'),
            country: z.string().optional().describe('País del Meeti de interés del usuario'),
            today: z.boolean().default(false).describe('El usuario desea un meeti o evento hoy')
        }),
        execute: async({query, city, country, today}) => {
             const meetis = await meetiService.getInPersonMeetis(query, city, country, today)

            if(!meetis.length) {
                return {
                    meetis: [],
                    totalFound: 0,
                    message: `No encontré meetis con ${query ? `relacionados con ${query}` : ''} en esta ubicación ¿Te gustaría intentar con otra búsquedad?`
                }
            }

            return {
                meetis,
                totalFound: meetis.length
            }
        }
    })
}