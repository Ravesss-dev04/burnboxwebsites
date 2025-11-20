"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const SectionScrollProgress = () => {
  const sectionIds = ["home", "why-choose-burnbox", "gallery", "maps"]
  const [activeIndex, setActiveIndex] = useState(-1) // start at -1 so width = 0 initially
    const pathname = usePathname()
  
  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex((sec) => sec === entry.target)
            setActiveIndex(index)
          }
        })
      },
      { threshold: 0.5 }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  // Calculate progress (0% until first section is visible)
  const progress =
    activeIndex === 0 ? 0 : ((activeIndex + 1) / sectionIds.length) * 100

  return (
    <motion.div
      className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 z-[9999] origin-left"
      style={{
        width: `${progress}%`,
        transition: "width 0.4s ease-out",
      }}
    />
  )
}

export default SectionScrollProgress
