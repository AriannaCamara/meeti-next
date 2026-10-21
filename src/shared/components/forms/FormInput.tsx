import clsx from "clsx"
import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>

export function FormInput(props: Props) {
    const { className } = props
  return (
    <input
        {...props}
        className={clsx(
            "border border-cyan-700/30 w-full rounded-xl p-2",
            "bg-white text-gray-900 placeholder:text-gray-400",
            "dark:border-white/20 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500",
            className
        )}
    />
  )
}
