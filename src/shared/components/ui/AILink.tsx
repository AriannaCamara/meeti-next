import Link from "next/link";


export default function AILink() {
  return (
    <div>
      <Link
        href={'/ai'}
        className="font-bold text-sm lg:text-lg whitespace-nowrap"
      >Asistente <span className="text-pink-600 font-black">IA</span> </Link>
    </div>
  )
}
