"use server"

import { requiereAuth } from "@/lib/auth-server"
import { membershipService } from "../services/MembershipService"

export async function toggleMembershipActions(communityId: string) {
    const { session } = await requiereAuth()
    if(!session) throw new Error('Usuario no autenticado')

    const response = await membershipService.toggleMembership(communityId, session.user)
    return response
}  