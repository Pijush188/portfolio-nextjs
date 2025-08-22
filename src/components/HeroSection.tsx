"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Facebook, Instagram, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Galaxy from "./ui/Galaxy"

const HeroSection = () => {
  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/pijush-das-56a759294/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/Pijush188", label: "GitHub" },
    { icon: Facebook, href: "https://www.facebook.com/Pijush188/", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/pijush_188/", label: "Instagram" },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="h-screen bg-black text-white flex items-center justify-center px-6 md:px-20 pt-24 pb-8 relative overflow-hidden">
      {/* Galaxy Background */}
      <div className="absolute inset-0 w-full h-full">
        <Galaxy
          mouseInteraction={true}
          mouseRepulsion={true}
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
          transparent={true}
        />
      </div>
      
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative z-10 pointer-through">
        {/* Content */}
        <motion.div 
          className="flex-1 flex flex-col items-baseline text-left lg:order-1 order-2"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Hi, It's <span className="text-cyan-400">Pijush</span>
          </motion.h1>

          <motion.div 
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6 h-12 lg:h-16 flex items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            I'm a <span className="text-cyan-400 ml-3">Jr. Data Scientist</span>
          </motion.div>

          <motion.div
            className="text-sm md:text-base lg:text-lg leading-relaxed mb-8 max-w-4xl text-justify font-light text-gray-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p>
              B.Tech graduate in Information Technology, currently working as a Junior Data Scientist at Calsoft, with hands-on experience in designing and deploying machine learning (ML), deep learning (DL), and Generative AI (GenAI) solutions. Skilled in leveraging advanced GenAI frameworks and tools such as LangChain agents, LangGraph, Graph Databases, and Retrieval-Augmented Generation (RAG). Proficient in building scalable AI applications with FastAPI for backend development and HTML, CSS, JavaScript, and React for frontend development. Demonstrated ability to work across the end-to-end AI/ML pipeline—from data preprocessing and model training to deployment, optimization, and integration into production-ready systems.
            </p>
          </motion.div>

          {/* Social Icons */}
          <motion.div 
            className="flex gap-4 mb-8 pointer-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 lg:w-14 lg:h-14 border-2 border-cyan-400 rounded-full flex items-center justify-center text-cyan-400 text-xl pointer-auto"
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "0 0 0px #00ffee",
                }}
                whileHover={{ 
                  scale: 1.2, 
                  y: -4,
                  backgroundColor: "#00ffee",
                  color: "#000000",
                  boxShadow: "0 0 20px #00ffee"
                }}
                whileTap={{ 
                  scale: 0.9
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.8 + index * 0.05, 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  // Define specific transitions for different states
                  scale: { type: "tween", duration: 0.1, ease: "easeOut" },
                  y: { type: "tween", duration: 0.1, ease: "easeOut" },
                  backgroundColor: { type: "tween", duration: 0.1, ease: "easeOut" },
                  color: { type: "tween", duration: 0.1, ease: "easeOut" },
                  boxShadow: { type: "tween", duration: 0.1, ease: "easeOut" }
                }}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pointer-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Button
              asChild
              className="bg-cyan-400 text-black shadow-[0_0_25px_#00ffee] hover:shadow-[0_0_50px_#00ffee] px-6 py-2 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white pointer-auto"
            >
              <a href="/CV.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2" size={18} />
                Download CV
              </a>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => scrollToSection("#contact")}
              className="border-2 border-cyan-400 text-cyan-400 bg-transparent hover:bg-cyan-400 hover:text-black shadow-[0_0_25px_transparent] hover:shadow-[0_0_25px_#00ffee] px-6 py-2 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105 pointer-auto"
            >
              <Mail className="mr-2" size={18} />
              Contact
            </Button>
          </motion.div>
        </motion.div>

        {/* Profile Image */}
        <motion.div 
          className="flex-shrink-0 lg:order-2 order-1"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-1 shadow-[0_0_25px_#00ffee] hover:shadow-[0_0_50px_#00ffee,0_0_100px_#00ffee] transition-all duration-400">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                <Image
                  src="/image/myimage.jpg"
                  alt="Pijush Das"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
