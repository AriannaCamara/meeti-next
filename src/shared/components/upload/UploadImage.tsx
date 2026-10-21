import { UploadDropzone } from "@/shared/utils/uploadthing"
import { CommunityInput } from "@/src/features/communities/schemas/communitySchema"
import Image from "next/image"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { FormError } from "../forms"
import { MeetiInput } from "@/src/features/meetis/schemas/meetiSchema"
import { ProfileInput } from "@/src/features/profile/schemas/profileSchema"
import toast from "react-hot-toast"

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
                    const url = res?.[0]?.ufsUrl
                    if (!url) {
                        toast.error('La subida no devolvió una URL de imagen')
                        return
                    }
                    setUploadedImage(url)
                    setValue('image', url, {shouldValidate: true})
                    clearErrors('image')
                    toast.success('Imagen subida correctamente')
                }}
                onUploadError={(error) => {
                    console.error('Upload error:', error)
                    toast.error(`Error al subir la imagen: ${error.message}`)
                }}
                content={{
                    button: 'Subir Imagen',
                    label: "Elige un archivo o arrástralo aquí",
                    allowedContent: "Máximo 1 imagen de 8MB"
                }}
                config={{
                    mode: 'auto'
                }}
            />
            {errors.image && <FormError>{errors.image.message}</FormError>}

            {uploadedImage && (
                <>
                    <p className="text-lg font-semibold text-green-600">{uploadedImageLabel}</p>
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
