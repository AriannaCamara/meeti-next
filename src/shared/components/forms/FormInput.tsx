import clsx from "clsx"
import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>

export function FormInput(props: Props) {
    const { className } = props
  return (
    <input 
        {...props}
        className={clsx("border border-cyan-700/30 w-full rounded-xl p-2", className)}
    />
  )
}
