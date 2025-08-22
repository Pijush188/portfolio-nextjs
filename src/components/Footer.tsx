"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Facebook, Instagram } from "lucide-react"
import Particles from "./ui/Particles"

const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/pijush-das-56a759294/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/Pijush188", label: "GitHub" },
    { icon: Facebook, href: "https://www.facebook.com/Pijush188/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/pijush_188/", label: "Instagram" },
  ]

  const navLinks = [
    { href: "#", label: "FAQ" },
    { href: "#education", label: "Education" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ]

  const scrollToSection = (href: string) => {
    if (href === "#") return
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-16 px-6 md:px-20 relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 w-full h-full">
        <Particles
          particleCount={80}
          particleSpread={6}
          speed={0.02}
          particleColors={["#00ffee", "#ffffff", "#999999"]}
          moveParticlesOnHover={false}
          alphaParticles={true}
          particleBaseSize={50}
          sizeRandomness={0.6}
          cameraDistance={14}
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 border-2 border-cyan-400 rounded-full flex items-center justify-center text-cyan-400 text-xl transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_25px_#00ffee]"
              whileHover={{ scale: 1.2, y: -10 }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          className="flex justify-center gap-8 md:gap-12 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {navLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(link.href)
              }}
              className="text-white text-lg hover:text-cyan-400 border-b-2 border-transparent hover:border-cyan-400 transition-all duration-300 cursor-pointer"
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.nav>

        {/* Copyright */}
        <motion.div
          className="text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2025 Pijush Das. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
