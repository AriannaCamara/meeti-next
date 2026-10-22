import { UIMessage, convertToModelMessages, streamText } from "ai";
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { NextRequest } from "next/server";
import { tools } from  "@/src/features/ai/tools"

export async function POST(req: NextRequest) {
    if (!process.env.OPEN_ROUTER_KEY) {
        return Response.json(
            { error: 'El asistente no está configurado. Falta la API key.' },
            { status: 503 }
        )
    }

    try {
        const { messages } : {messages: UIMessage[]} = await req.json()
        const openrouter = createOpenRouter({
            apiKey: process.env.OPEN_ROUTER_KEY
        })

        const result = streamText({
            messages: await convertToModelMessages(messages),
            system: `Eres un asistente de Meeti AI que ayuda a encontrar comunidades y meetis. SIEMPRE responde en español.
            Nunca respondas en inglés.
            Sé breve y natural.`,
            model: openrouter('minimax/minimax-m3.1-flash:free'),
            tools
        })
        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error('[chat] Error:', error)
        return Response.json(
            { error: 'El asistente está saturado o hubo un error. Intenta en unos minutos.' },
            { status: 500 }
        )
    }
}
