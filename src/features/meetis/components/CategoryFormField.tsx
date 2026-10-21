"use client"

import { FormError, FormLabel, FormSelect } from "@/shared/components/forms"
import { Suspense, use } from "react"
import { SelectCategory } from "../types/meeti.types"
import { useFormContext } from "react-hook-form"
import { MeetiInput } from "../schemas/meetiSchema"

// Promesa cacheada: crear un fetch en cada render suspiende el componente y remonta el select
const categoriesPromise = fetch('/api/categories').then(res => res.json())

function CategoryOptions() {
    const { register, formState: { errors } } = useFormContext<MeetiInput>()

    const categories = use(categoriesPromise) as SelectCategory[]

    return (
        <>
            <FormLabel htmlFor="categoryId">Categoría Meeti</FormLabel>

            <FormSelect id="categoryId" {...register('categoryId')}>
                <option value="">Selecciona Categoría</option>

                {Array.isArray(categories) && categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </FormSelect>

            {errors.categoryId && (
                <FormError>{errors.categoryId.message}</FormError>
            )}
        </>
    )
}

export default function CategoryFormField() {
    return (
        <Suspense fallback={"Cargando categorías..."}>
            <CategoryOptions />
        </Suspense>
    )
}
