import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>

export function FormSubmit(props: Props) {
  return (
    <input {...props} type="submit" className="disabled:opacity-50 w-full p-2 cursor-pointer text-white rounded-full 
                     bg-linear-to-r from-pink-500 to-rose-500 
                     shadow-md hover:shadow-lg 
                     hover:from-pink-600 hover:to-rose-600
                     duration-300 mt-5 block lg:inline-block text-center transition-colors text-xs lg:text-xl py-3 px-10  font-bold " />
  )
}


     