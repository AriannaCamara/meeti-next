"use client"

import { Form, FormSubmit } from "@/shared/components/forms"
import MeetiForm from "./MeetiForm"
import { useSession } from "@/lib/auth-client"
import { FormProvider, useForm } from "react-hook-form"
import { MeetiInput, MeetiSchema } from "../schemas/meetiSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { createMeetiAction } from "../actions/meeti-actions"
import toast from "react-hot-toast"
import { redirect } from "next/navigation"

export default function CreateMeeti() {

    const methods = useForm<MeetiInput>({
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
   const {error, success} = await createMeetiAction(data)
    if(error) {
      toast.error(error)
    }
    if(success) {
      toast.success(success)
      redirect('/dashboard/meetis')
    }
  }

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={methods.handleSubmit(onSubmit)} noValidate
      >
        <MeetiForm />
        <FormSubmit value={'Crear Meeti'} />
      </Form>
    </FormProvider>
    
  )
}
