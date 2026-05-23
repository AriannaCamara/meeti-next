"use server"

import { requiereAuth } from "@/lib/auth-server";
import { MeetiInput, MeetiSchema } from "../schemas/meetiSchema";
import { meetiService } from "../services/MeetiService";

export async function createMeetiAction(input: MeetiInput) {
    const { session } = await requiereAuth()
    if(!session) {
        return {
            error: 'Usuario No Autenticado',
            success: ''
        }
    }

    const data = MeetiSchema.safeParse(input)
    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }
    await meetiService.createMeeti(data.data, session.user)

    return {
        success: 'Meeti Creado Correctamente',
        error: ''
    }
}

export async function editMeetiAction(input: MeetiInput, meetiId: string) {
    const { session } = await requiereAuth()
    if(!session) {
        return {
            error: 'Usuario No Autenticado',
            success: ''
        }
    }

    const data = MeetiSchema.safeParse(input)
    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }
    await  meetiService.updateMeeti(meetiId, data.data, session.user)

    return {
        error: '',
        success: 'Meeti Actualizado Correctamente'
    }
}

export async function deleteMeetiAction(meetiId: string) {
    const { session } = await requiereAuth()
    if(!session) {
        return {
            error: 'Usuario No Autenticado',
            success: ''
        }
    }
    const response = await meetiService.deleteMeeti(meetiId, session.user)
    return response 
}