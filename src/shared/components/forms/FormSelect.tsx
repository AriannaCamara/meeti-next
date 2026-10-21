import clsx from "clsx"
import { SelectHTMLAttributes } from "react"

type Props = SelectHTMLAttributes<HTMLSelectElement>

export function FormSelect(props: Props) {
  const { className } = props
  return (
    <select
        {...props}
        className={clsx(
            "border border-cyan-700/30 w-full p-2 rounded-xl",
            "bg-white text-gray-900",
            "dark:border-white/20 dark:bg-gray-900 dark:text-white",
            className
        )}
    >{props.children}</select>
  )
}
