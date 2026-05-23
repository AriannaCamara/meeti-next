import { SelectHTMLAttributes } from "react"

type Props = SelectHTMLAttributes<HTMLSelectElement>

export function FormSelect(props: Props) {
  return <select {...props} className="border border-cyan-700/30 w-full p-2 rounded-xl" >{props.children}</select>
}
