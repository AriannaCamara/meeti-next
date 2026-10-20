"use client"

import { Form, FormSubmit } from "@/shared/components/forms"
import MeetiForm from "./MeetiForm"
import { useSession } from "@/lib/auth-client"
import { FormProvider, useForm } from "react-hook-form"
import { MeetiFormInput, MeetiInput, MeetiSchema } from "../schemas/meetiSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createMeetiAction } from "../actions/meeti-actions"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function CreateMeeti() {

    const router = useRouter()

    const methods = useForm<MeetiFormInput, unknown, MeetiInput>({
    resolver: zodResolver(MeetiSchema),
    mode: 'all',
    defaultValues: {
      title: '',
      details: '',
      categoryId: '',
      communityId: '',
      availableSeats: 0,
      date: '',
      time: '',
      image: '',
      virtual: false,
      location: {
        placeName: '',
        address: '',
        city: '',
        country: '',
        lat: 40.415339, 
        lng: -3.707916
      }
    }
  })

  const { isPending } = useSession()
  if(isPending) return 'Cargando...'

  const onSubmit = async (data: MeetiInput) => {
    try {
      const {error, success} = await createMeetiAction(data)
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
      toast.error('Error inesperado al crear el Meeti')
    }
  }

  const { isSubmitting } = methods.formState

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={methods.handleSubmit(onSubmit)} noValidate
      >
        <MeetiForm />
        <FormSubmit
          value={isSubmitting ? 'Creando...' : 'Crear Meeti'}
          disabled={isSubmitting}
        />
      </Form>
    </FormProvider>
    
  )
}
