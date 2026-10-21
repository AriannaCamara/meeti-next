"use client"

import { useFormState } from "react-hook-form"
import { FieldErrors, FieldValues } from "react-hook-form"

function flattenErrors(errors: FieldErrors): { path: string, message: string }[] {
    const result: { path: string, message: string }[] = []

    for (const [key, value] of Object.entries(errors)) {
        if (!value) continue

        if (value && typeof value === 'object' && 'message' in value && typeof (value as { message?: unknown }).message === 'string') {
            result.push({ path: key, message: (value as { message: string }).message })
        } else if (value && typeof value === 'object') {
            for (const nested of flattenErrors(value as FieldErrors)) {
                result.push({ path: `${key}.${nested.path}`, message: nested.message })
            }
        }
    }

    return result
}

export function FormErrorSummary<T extends FieldValues>() {
    const { errors, submitCount, isSubmitting } = useFormState<T>()

    if (submitCount === 0 || isSubmitting) return null

    const flat = flattenErrors(errors as FieldErrors)
    if (flat.length === 0) return null

    return (
        <div className="rounded-xl border-l-4 border-red-600 bg-red-50 p-4 space-y-1 dark:bg-red-950/40">
            <p className="font-bold text-red-700 dark:text-red-300">
                Corrige estos {flat.length} {flat.length === 1 ? 'campo' : 'campos'}:
            </p>
            <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-200">
                {flat.map(({ path, message }) => (
                    <li key={path}>
                        <span className="font-semibold">{path}</span>: {message}
                    </li>
                ))}
            </ul>
        </div>
    )
}
