import { create } from 'zustand'
import * as profileApi from '../api/profile'

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    const { data } = await profileApi.getNotifications()
    set({
      notifications: data,
      unreadCount: data.filter((n) => !n.read).length,
    })
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 })
  },
}))

export default useNotificationStore
