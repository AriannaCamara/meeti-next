"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {Form, FormLabel, FormInput, FormSubmit, FormError} from "@/components/forms"
import { SignInInput, SignInSchema } from "../schemas/authSchema"
import toast from "react-hot-toast"
import { signInAction } from "../actions/auth-actions"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function LoginForm() {
  const [locked, setLocked] = useState(false)

  const {register, handleSubmit, formState: {errors, isSubmitting } } = useForm({
    resolver: zodResolver(SignInSchema),
    mode: 'all'
  })

  const onSubmit = async (data: SignInInput) => {
    if(locked) return
    setLocked(true)

    const {success, error } = await signInAction(data)
    if(error) {
      toast.error(error)
    }
    if(success) {
      toast.success(success)
      redirect('/dashboard')
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
    >
        <FormLabel htmlFor="email">E-mail</FormLabel>
        <FormInput
            type="email"
            id="email"
            placeholder="Ingresa tu E-mail"
            {...register('email')}
        />
        {errors.email && <FormError>{errors.email.message}</FormError>}

        <FormLabel htmlFor="password">Password</FormLabel>
        <FormInput
            type="password"
            id="password"
            placeholder="Ingresa tu Password"
            {...register('password')}
        />
        {errors.password && <FormError>{errors.password.message}</FormError>}
        
        <FormSubmit 
          value={isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
          disabled={isSubmitting || locked}
        />

    </Form>
  )
}
