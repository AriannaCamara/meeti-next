import { UploadDropzone } from "@/shared/utils/uploadthing"
import { CommunityInput } from "@/src/features/communities/schemas/communitySchema"
import Image from "next/image"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { FormError } from "../forms"
import { MeetiInput } from "@/src/features/meetis/schemas/meetiSchema"
import { ProfileInput } from "@/src/features/profile/schemas/profileSchema"

type Props = {
    uploadedImageLabel: string
}

export default function UploadImage({uploadedImageLabel}: Props) {

    const { formState: {errors}, setValue, clearErrors, getValues } = useFormContext<CommunityInput | MeetiInput | ProfileInput >()
    const [uploadedImage, setUploadedImage] = useState('')
    const currentImage = getValues('image') ? getValues('image') : null
  return (
    <>
        <UploadDropzone
                endpoint={'meetiUploader'}
                className="ut-button:bg-orange-500"
                onClientUploadComplete={(res) => {
                    setUploadedImage(res[0].ufsUrl)
                    setValue('image', res[0].ufsUrl, {shouldValidate: true})
                    clearErrors('image')
                }}
                content={{
                    button: 'Subir Imagen',
                    label: "Elige un archivo o arrástralo aquí",
                    allowedContent: "Máximo 1 imagen de 1MB"
                }}
                config={{
                    mode: 'auto'
                }}
            />
            {errors.image && <FormError>{errors.image.message}</FormError>}

            {uploadedImage && (
                <>
                    <p className="text-lg">{uploadedImageLabel}</p>
                    <Image
                        src={uploadedImage}
                        alt="Imagen publicada"
                        width={300}
                        height={200}
                    />
                </>
            )}
            {currentImage && !uploadedImage && (
                <>
                    <p className="text-lg">Imagen Actual:</p>
                    <Image
                        src={currentImage}
                        alt="Imagen publicada"
                        width={300}
                        height={200}
                    />
                </>
            )}
    </>
  )
}
