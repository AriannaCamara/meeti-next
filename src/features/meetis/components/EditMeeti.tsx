
"use client" 
import { Form, FormSubmit } from "@/shared/components/forms";
import MeetiForm from "./MeetiForm";
import { FormProvider, useForm } from "react-hook-form";
import { MeetiFormInput, MeetiInput, MeetiSchema } from "../schemas/meetiSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectMeeti } from "../types/meeti.types";
import { editMeetiAction } from "../actions/meeti-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
    meeti: SelectMeeti
}

export default function EditMeeti({meeti} : Props) {
    const router = useRouter()
    const methods = useForm<MeetiFormInput, unknown, MeetiInput>({
        resolver: zodResolver(MeetiSchema),
        mode: 'all',
        defaultValues: meeti.virtual ? 
        {
            ...meeti,
            virtual: true,
        } : 
        {
            ...meeti,
            location: meeti.location!
        }
    })

    const onSubmit = async (data: MeetiInput) => {
        try {
            const {error, success} = await editMeetiAction(data, meeti.id)
            if(error) {
                toast.error(error)
                return
            }
            if(success) {
                toast.success(success)
                router.push('/dashboard/meetis')
            }
        } catch (err) {
            console.error(err)
            toast.error('Error inesperado al actualizar el Meeti')
        }
    }

    const { isSubmitting } = methods.formState

  return (
    <FormProvider {...methods}>
    <Form onSubmit={methods.handleSubmit(onSubmit)} >
        <MeetiForm />
        <FormSubmit
            value={isSubmitting ? 'Guardando...' : 'Actualizar'}
            disabled={isSubmitting}
        />
    </Form>
    </FormProvider>
  )
}
