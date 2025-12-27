"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        fixed top-4 right-4 z-50
        rounded-full px-4 py-2
        bg-card-light dark:bg-card-dark
        text-text-light dark:text-text-dark
        transition-all duration-300
        hover:scale-105
        cursor-pointer
      "
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  )
}
