import { create } from 'zustand'

const useUiStore = create((set) => ({
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'light',
  globalSearchQuery: '',
  aiLoading: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },

  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  setAiLoading: (loading) => set({ aiLoading: loading }),
}))

export default useUiStore
