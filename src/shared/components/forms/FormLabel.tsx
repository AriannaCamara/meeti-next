import clsx from "clsx"
import { LabelHTMLAttributes } from "react"

type Props = LabelHTMLAttributes<HTMLLabelElement>

export function FormLabel(props: Props) {
  const { className } = props
  return (
    <label
        {...props}
        className={clsx(
            "block text-gray-900 dark:text-gray-100",
            className
        )}
    >{props.children}</label>
  )
}
