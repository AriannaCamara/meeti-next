

export function FormError({children} : {children: React.ReactNode}) {
  return (
    <p className="border-l-3 p-2 font-bold bg-red-100 border-red-600 text-red-600 text-sm">{children}</p>
  )
}
