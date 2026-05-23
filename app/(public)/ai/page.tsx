import Heading from '@/shared/components/typography/Heading'
import { generatePageTitle } from '@/shared/utils/metadata'
import AISearch from '@/src/features/ai/components/AISearch'
import { Metadata } from 'next' 

export const metadata : Metadata = {
    title: generatePageTitle('Asistente IA')
}

export default function AIPage() {

  return (
    <main className='py-16 max-w-4xl mx-auto'>
        <Heading className='font-black uppercase text-3xl bg-linear-to-r from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent'>Asistente IA Meeti</Heading>
        <AISearch />
    
    </main>
  )
}
