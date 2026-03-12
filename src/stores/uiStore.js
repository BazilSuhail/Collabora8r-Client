import { create } from 'zustand'

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    return 'dark'
  }
  return 'light'
}

const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const useUiStore = create((set) => ({
  sidebarOpen: true,
  theme: getInitialTheme(),
  globalSearchQuery: '',
  aiLoading: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    applyTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', newTheme)
      applyTheme(newTheme)
      return { theme: newTheme }
    })
  },

  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  setAiLoading: (loading) => set({ aiLoading: loading }),
}))

applyTheme(getInitialTheme())

export default useUiStore
