import Heading from "@/shared/components/typography/Heading";
import { authService } from "../services/AuthService";
import { formatUserAgent } from "@/shared/utils/user-agent";
import RevokeSessionButton from "./RevokeSessionButton";


export default async function ActiveSessionsList() {
    const [sessions, currentSession] = await Promise.all([
        authService.getSessions(),
        authService.getSession()
    ])

    const isCurrentDevice = (currentSessionId: string) => currentSessionId === currentSession?.session.id 
    
  return (
    <>
        <Heading level={2} className="mt-10 bg-linear-to-r mb-10 from-cyan-500 to-cyan-800 bg-clip-text text-transparent">Sessiones Activas</Heading>
        <div className="mt-10 p-5 border border-gray-200 rounded-2xl">
            {sessions.map(session => (
                <div key={session.id} className="p-5 shadow-xs flex items-center">
                    <div className="lg:flex lg:gap-2 lg:items-center flex-1">
                        <p>{formatUserAgent(session.userAgent!)}</p>
                        {isCurrentDevice(session.id) && <p className="text-green-600 font-bold bg-green-200 border border-green-200 rounded-sm inline-block px-3 py-1 uppercase text-xs">Este Dispositivo</p> }
                    </div>
                    <RevokeSessionButton token={session.token} />
                </div>
            ))}
        </div>
    </>
  )
}
