import { requiereAuth } from "@/lib/auth-server"
import Heading from "@/shared/components/typography/Heading"
import { generatePageTitle } from "@/shared/utils/metadata"
import NotificationList from "@/src/features/notifications/components/NotificationList"
import { notificationService } from "@/src/features/notifications/services/NotificationService"
import { Metadata } from "next"
import { redirect } from "next/navigation"

const title = 'Tus Notificaciones'
export const metadata: Metadata = {
    title: generatePageTitle(title)
}

export default async function NotificationsPage() {
    const {session} = await requiereAuth()
    if(!session) redirect('/auth/login')

    const notifications = await notificationService.getUserNotifications(session.user.id)
    await notificationService.clearNotifications(session.user.id)

    return (
    <>
        <Heading className="bg-linear-to-r from-cyan-500 to-cyan-800 text-center bg-clip-text text-transparent">{title}</Heading>
        <NotificationList notifications={notifications} />
    </>
  )
}
