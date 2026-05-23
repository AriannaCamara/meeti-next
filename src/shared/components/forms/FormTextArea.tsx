import { TextareaHTMLAttributes } from "react"

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>

export function FormTextarea(props: Props) {
    return <textarea {...props} className="border border-cyan-700/30 w-full p-2 h-40 rounded-2xl" />
}
