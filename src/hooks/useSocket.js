import { useEffect } from 'react'
import useSocketStore from '../stores/socketStore'
import useAuthStore from '../stores/authStore'

const useSocket = () => {
  const { user } = useAuthStore()
  const { socket, isConnected, connect, disconnect, joinProject, leaveProject } = useSocketStore()

  useEffect(() => {
    if (user?._id) {
      connect(user._id)
      return () => disconnect()
    }
  }, [user?._id])

  return {
    socket,
    isConnected,
    joinProject,
    leaveProject,
  }
}

export default useSocket
