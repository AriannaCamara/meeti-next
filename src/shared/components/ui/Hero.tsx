import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[url('/hero.jpg')] bg-cover bg-center h-150 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center max-w-2xl">
        <h1 className="text-3xl lg:text-4xl text-white uppercase font-black text-center">
          Encuentra Un Meeti o Crea una Comunidad para
          compartir lo que más te gusta
        </h1>

        {/* Botón moderno */}
        <Link 
          href="/auth/create-account"
          className="text-xl font-semibold text-white px-10 py-3 rounded-full 
                     bg-linear-to-r from-pink-500 to-rose-500 
                     shadow-md hover:shadow-lg 
                     hover:from-pink-600 hover:to-rose-600
                     transition-all duration-300 mt-5"
        >
          Obtener una cuenta
        </Link>
      </div>
    </section>
  );
}