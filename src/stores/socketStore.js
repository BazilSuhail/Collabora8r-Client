import { create } from 'zustand'
import { io } from 'socket.io-client'
import { API_BASE_URL } from '../utils/constants'

const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (userId) => {
    const existing = get().socket
    if (existing?.connected) return

    const socket = io(API_BASE_URL, {
      auth: { userId },
    })

    socket.on('connect', () => set({ isConnected: true }))
    socket.on('disconnect', () => set({ isConnected: false }))

    set({ socket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  joinProject: (projectId) => {
    const { socket } = get()
    socket?.emit('join-project', projectId)
  },

  leaveProject: (projectId) => {
    const { socket } = get()
    socket?.emit('leave-project', projectId)
  },

  onNotification: (callback) => {
    const { socket } = get()
    socket?.on('notification', callback)
  },
}))

export default useSocketStore
