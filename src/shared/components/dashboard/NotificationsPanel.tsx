"use client"

import { BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import { useSession } from '@/lib/auth-client'

function NotificationCount() {

  const [totalNotifications, setTotalNotifications] = useState<number>(0)
  const { data } = useSession()

  // 🔥 cargar notificaciones SOLO en cliente (evita build error)
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await fetch('/api/user/notifications')
        const data = await res.json()
        setTotalNotifications(data)
      } catch (err) {
        console.error(err)
      }
    }

    loadNotifications()
  }, [])

  // 🔥 Pusher solo si hay usuario
  useEffect(() => {
    if (!data?.user?.id) return

    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
      }
    )

    const channel = pusher.subscribe(`notifications-channel-${data.user.id}`)

    channel.bind('new-notification', () => {
      setTotalNotifications((prev) => prev + 1)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }

  }, [data?.user?.id])

  return (
    <Link
      href={'/dashboard/notifications'}
      className="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 dark:hover:text-white"
    >
      <span className="sr-only">View notifications</span>
      <BellIcon aria-hidden="true" className="size-6" />

      {totalNotifications > 0 && (
        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white p-2">
          {totalNotifications}
        </span>
      )}
    </Link>
  )
}

export default function NotificationsPanel() {
  return (
    <Suspense fallback={null}>
      <NotificationCount />
    </Suspense>
  )
}