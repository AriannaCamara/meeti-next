"use client"
import { useChat } from '@ai-sdk/react'
import { Form, FormLabel, FormSubmit, FormTextarea } from "@/shared/components/forms"
import { useState } from 'react'
import { Message } from '../types/ai.types'
import CommunityCard from '../../communities/components/CommunityCard'
import { SelectCommunity } from '../../communities/types/community.types' // 👈 AQUI
import MeetiCard from '../../meetis/components/MeetiCard'

// 👇 AQUI
type RecommendedCommunity = Omit<SelectCommunity, 'createdAt' | 'createdBy'> & {
    membersCount: string
}

export default function AISearch() {
    const [input, setInput] = useState('')
    const {messages, status, sendMessage}  = useChat<Message>() 

    return (
        <>
            {messages.map(message => (
                <div 
                    key={message.id} 
                    className='whitespace-pre-wrap mt-5 p-5 border-b border-gray-300 last-of-type:border-none'
                >
                    <p className={`${message.role == 'user' ? 'text-right' : 'text-left'} font-black`}>
                        {message.role == 'user' ? 'Usuario:' : 'Meeti AI:'}
                    </p>
                    {message.parts.map((part, i) => {
                        const key = `${message.id}-${i}`

                        // texto
                    if(part.type === 'text') {
                        return (
                            <div
                                key={key}
                                className={message.role === 'user' ? 'text-right' : 'text-left'}
                                dangerouslySetInnerHTML={{__html: part.text}}
                            ></div>
                        )
                    }
                    // comunidades 
                    if(part.type === 'tool-getRecommendedCommunities') {
                        if(part.state !== 'output-available') return null
                        
                        
                        const { communities } = part.output as {
                            communities: RecommendedCommunity[]
                        }

                        if(!communities.length) return (
                            <p key={key}>{part.output.message}</p>
                        )

                        return (
                            <div key={key} className='space-y-4' >
                                <p className='text-gray-700 font-medium'>
                                    Encontré {communities.length === 1 ? 'Esta Comunidad' : `${communities.length} Comunidades`} sobre {''}
                                    <span className='text-orange-600 font-bold'>{part.input.query}</span>
                                </p>

                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10'>
                                {communities.map(c => (
                                    <CommunityCard 
                                        key={c.id}
                                        community={c}
                                        target={true}
                                    />
                                ))}
                                </div>
                            </div>
                        )
                    }

                    if(part.type === 'tool-getMeetisBySubject' || 
                        part.type === 'tool-getVirtualMeetis' ||
                        part.type === 'tool-getInPersonMeetis'
                    ) {
                        if(part.state !== 'output-available') return null 

                        const { meetis } = part.output

                        if(!meetis.length) return (
                            <p key={key}>{part.output.message}</p>
                        )

                        const typeText = part.type === 'tool-getVirtualMeetis'
                            ? { singular : 'Meeti virtual', plural: 'Meetis virtuales'}
                            : part.type === 'tool-getInPersonMeetis'
                                ? { singular: 'Meeti enesta ubicación', plural: 'Meetis en esta ubicación'}
                                : { singular: 'Meeti', plural: 'Meeti'};

                        return (
                            <div key={key} className='space-y-4'>
                                <p className='text-gray-700 font-medium'>
                                    Encontré{''}
                                    {meetis.length === 1 ? (
                                        <>
                                            Este{' '}
                                            <span className='text-orange-600 font-bold'>
                                                {typeText.singular}
                                            </span>
                                        </>
                                    ): (
                                        <>
                                            <span className='text-orange-600 font-bold'>
                                                {meetis.length}
                                            </span> {' '}
                                            {typeText.plural}
                                        </>
                                    )}

                                    {part.input.query && (
                                        <>
                                            {" sobre "}
                                            <span className='text-orange-600 font-bold'>
                                                {part.input.query}
                                            </span>
                                        </>
                                    )}

                                </p>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10'>
                                    {meetis.map(m => (
                                        <MeetiCard 
                                            key={m.id}
                                            meeti={m}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    }
                })}
                </div>
            ))}

            {status === 'submitted' && (
                <div className='flex items-center justify-center py-5 gap-2 text-gray-500'>
                    <div className='animate-spin size-5 border-2 border-t-transparent border-gray-400 rounded-full' />
                    Pensando...
                </div>
            )}

            <Form
                onSubmit={e => {
                    e.preventDefault()
                    sendMessage({text: input})
                    setInput('')
                }}
            >
                <FormLabel htmlFor="prompt">Busca Meetis y Communidades utilizando IA</FormLabel>
                <FormTextarea 
                    id="prompt"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />

                <FormSubmit 
                    value={'Consultar'}
                    disabled={input.trim() === '' || status === 'submitted'}
                />
            </Form>
            
        </>
    )
}
