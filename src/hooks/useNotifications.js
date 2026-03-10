import { useEffect } from 'react'
import useNotificationStore from '../stores/notificationStore'
import useSocketStore from '../stores/socketStore'

const useNotifications = () => {
  const { notifications, unreadCount, fetchNotifications, addNotification, markAsRead, clearAll } = useNotificationStore()
  const { socket, isConnected } = useSocketStore()

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    if (!socket || !isConnected) return

    const handler = (notification) => addNotification(notification)
    socket.on('notification', handler)
    return () => socket.off('notification', handler)
  }, [socket, isConnected])

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    addNotification,
    markAsRead,
    clearAll,
  }
}

export default useNotifications
