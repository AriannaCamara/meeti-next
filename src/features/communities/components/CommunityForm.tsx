import { FormError, FormInput, FormLabel, FormTextarea } from "@/shared/components/forms";
import { useFormContext } from "react-hook-form";
import { CommunityInput } from "../schemas/communitySchema";
import UploadImage from "@/shared/components/upload/UploadImage";

export default function ComunityForm() {

    const { register, formState: {errors}} = useFormContext<CommunityInput>()
    return (
        <>
            <FormLabel htmlFor="name">Nombre Comunidad</FormLabel>
            <FormInput 
                id="name"
                type="text"
                placeholder="Titulo Comunidad"
                {...register('name')}
            />
            {errors.name && <FormError>{errors.name.message}</FormError>}
            
            <FormLabel>Imagen Comunidad</FormLabel>
            <UploadImage 
                uploadedImageLabel="Imagen Publicada Comunidad:"
            />

            <FormLabel htmlFor="descripcion">Descripción Comunidad</FormLabel>
            <FormTextarea 
                id="description"
                placeholder="Descripción Comunidad"
                {...register('description')}
            />            
            {errors.description && <FormError>{errors.description.message}</FormError>}
        </>
    )
}