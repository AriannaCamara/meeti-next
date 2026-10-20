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
            error: 'Datos Inválidos',
            success: ''
        }
    }

    try {
        await meetiService.createMeeti(data.data, session.user)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al crear el Meeti'
        return {
            error: message,
            success: ''
        }
    }

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
            error: 'Datos Inválidos',
            success: ''
        }
    }

    try {
        await meetiService.updateMeeti(meetiId, data.data, session.user)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al actualizar el Meeti'
        return {
            error: message,
            success: ''
        }
    }

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
    try {
        const response = await meetiService.deleteMeeti(meetiId, session.user)
        return response
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al eliminar el Meeti'
        return {
            error: message,
            success: ''
        }
    }
}