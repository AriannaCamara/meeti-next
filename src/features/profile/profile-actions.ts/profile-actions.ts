"use server"

import { requiereAuth } from "@/lib/auth-server";
import { ProfileInput, ProfileSchema } from "../schemas/profileSchema";
import { profileService } from "../services/ProfileService";

export async function updateProfileAction(input: ProfileInput) {
    const { session } = await requiereAuth()
    if(!session) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    }

    const data = ProfileSchema.safeParse(input)
    if(!data.success) {
        return {
            error: 'Hubo un error',
            success: ''
        }
    } 
    await profileService.updateProfile(data.data)
    return {
        error: '',
        success: 'Perfil Actualizado Correctamente'
    }
}