import { useEffect } from 'react'
import useUiStore from '../stores/uiStore'

const useTheme = () => {
  const { theme, setTheme } = useUiStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return { theme, setTheme }
}

export default useTheme
