"use client"

import type React from "react"

import { useState, useEffect } from "react"
import SunIcon from "../icons/SunIcon"
import MoonIcon from "../icons/MoonIcon"
import "./ThemeToggle.css"

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.setAttribute("data-theme", "dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)

    if (!isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.removeAttribute("data-theme")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

export default ThemeToggle

