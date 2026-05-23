import { requiereAuth } from "@/lib/auth-server";
import { communityService } from "@/src/features/communities/services/CommunityService";


export async function GET() {
    const { session } = await  requiereAuth();
    if(!session) return new Response(JSON.stringify([]))

        const communities = await communityService.getUserCommunitiesForAPI(session.user.id);
        return new Response(JSON.stringify(communities), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        })
}