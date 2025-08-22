"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#education", label: "Education" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section")
      const scrollPosition = window.scrollY + 150

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId || "")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <motion.header 
      className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 bg-black/30 backdrop-blur-lg"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection("#home")
          }}
          className="text-3xl md:text-4xl font-bold text-white cursor-pointer transition-transform hover:scale-110"
          whileHover={{ scale: 1.1 }}
        >
          Pijush <span className="text-cyan-400 drop-shadow-[0_0_25px_#00ffee]">Das</span>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(item.href)
              }}
              className={`ml-16 text-lg font-medium transition-all duration-300 border-b-3 ${
                activeSection === item.href.slice(1)
                  ? "text-cyan-400 border-cyan-400"
                  : "text-white border-transparent hover:text-cyan-400 hover:border-cyan-400"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-cyan-400 hover:bg-cyan-400/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden absolute top-full right-0 w-1/2 bg-black/80 backdrop-blur-lg rounded-bl-2xl border-l-2 border-b-2 border-cyan-400"
        >
          <div className="p-4">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(item.href)
                }}
                className="block text-xl text-white py-3 hover:text-cyan-400 transition-colors"
                whileHover={{ x: 10 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  )
}

export default Header
