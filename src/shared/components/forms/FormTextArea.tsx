import clsx from "clsx"
import { TextareaHTMLAttributes } from "react"

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>

export function FormTextarea(props: Props) {
    const { className } = props
    return (
        <textarea
            {...props}
            className={clsx(
                "border border-cyan-700/30 w-full p-2 h-40 rounded-2xl",
                "bg-white text-gray-900 placeholder:text-gray-400",
                "dark:border-white/20 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500",
                className
            )}
        />
    )
}
