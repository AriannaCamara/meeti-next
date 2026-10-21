import { FormError, FormLabel, FormSelect } from "@/shared/components/forms"
import { Suspense, use } from "react"
import { useFormContext } from "react-hook-form"
import { MeetiInput } from "../schemas/meetiSchema"

const communitiesPromise = fetch(`/api/user/communities`)
  .then(res => res.json())

function CommunityOptions() {
    const {register, formState: {errors}} = useFormContext<MeetiInput>()
    const communities = use<{id: string, name: string}[]>(communitiesPromise)
    
    return ( 
        <>
            <FormLabel htmlFor="communityId">Comunidad Meeti</FormLabel>

            <FormSelect
                id="communityId"
                {...register('communityId')}
            >
                <option value="">Selecciona Comunidad</option>
                {Array.isArray(communities) && communities.map(community => <option key={community.id} value={community.id}>{community.name}</option> )}
            </FormSelect>
            {errors.communityId && <FormError>{errors.communityId.message}</FormError>}
        </>
    )
}

export default function CommunityFormField() {
  return (
    <Suspense fallback={'Cargando...'}>
        <CommunityOptions />
    </Suspense>
  )
}
