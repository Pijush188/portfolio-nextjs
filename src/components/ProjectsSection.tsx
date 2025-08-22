"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useState } from "react"

const ProjectsSection = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [touchedProject, setTouchedProject] = useState<number | null>(null)

  const projectsData = [
    {
      title: "Smart Home Automation",
      description: "This project introduces a smart home solution using the ESP32 microcontroller for enhanced convenience and sustainability. Features include occupancy-based controls, water and air quality monitoring, weather-based adjustments, and voice assistant integration. With affordability, privacy, and user experience as priorities, it promises smarter living and future-ready advancements like AI and sustainability.",
      image: "/projectpic/SHA.jpg",
      githubUrl: "https://github.com/Pijush188/Smart-Home-Automation.git",
      liveUrl: null,
    },
    {
      title: "Chat Application",
      description: "This project is a feature-rich chat application inspired by WhatsApp, developed using Java Swing, Java AWT, and Java socket programming. The application provides a seamless user experience with an intuitive graphical interface, enabling real-time communication between users over a local network. Leveraging Java's robust socket programming for server-client communication.",
      image: "/projectpic/chat.jpg",
      githubUrl: "https://github.com/Pijush188/Chat-Application.git",
      liveUrl: null,
    },
    {
      title: "Apple Vision UI",
      description: "This project is an interactive and visually captivating website designed to replicate the look and feel of the original Apple Vision Pro website. Utilizing a combination of HTML, CSS, JavaScript, GSAP, ScrollTrigger, and Canva-JavaScript, the website features sophisticated animations and seamless user interactions. The design emphasizes modern web technologies to deliver a fluid and immersive experience, with dynamic scrolling effects, engaging transitions, and responsive layouts, all aimed at showcasing the product in an innovative, professional manner similar to the Apple Vision Pro's official presentation.",
      image: "/projectpic/applevisionpro.jpg",
      githubUrl: "https://github.com/Pijush188/apple-vision-ui.git",
      liveUrl: "https://pijush188.github.io/apple-vision-ui/",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const projectVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const handleProjectClick = (githubUrl: string, liveUrl?: string | null) => {
    if (liveUrl) {
      window.open(liveUrl, '_blank')
    } else {
      window.open(githubUrl, '_blank')
    }
  }

  const handleTouchStart = (index: number) => {
    setTouchedProject(index)
  }

  const handleTouchEnd = () => {
    setTimeout(() => setTouchedProject(null), 3000) // Hide after 3 seconds
  }

  const isProjectVisible = (index: number) => {
    return hoveredProject === index || touchedProject === index
  }

  return (
    <section id="projects" className="min-h-screen bg-gray-900 text-white py-32 px-6 md:px-20 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          className="text-6xl md:text-8xl font-bold text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Projects
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projectsData.map((project, index) => (
            <motion.div
              key={index}
              variants={projectVariants}
              className="group cursor-pointer"
              onHoverStart={() => setHoveredProject(index)}
              onHoverEnd={() => setHoveredProject(null)}
              onTouchStart={() => handleTouchStart(index)}
              onTouchEnd={handleTouchEnd}
              onClick={() => handleProjectClick(project.githubUrl, project.liveUrl)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="relative overflow-hidden bg-transparent border-none shadow-none h-[300px] sm:h-[400px] md:h-[640px] rounded-xl">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay with bottom-to-top animation */}
                  <AnimatePresence>
                    {isProjectVisible(index) && (
                      <motion.div
                        className="absolute left-0 bottom-0 w-full bg-gradient-to-t from-black/90 via-[#00ffee]/30 to-transparent flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 text-center rounded-xl"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "100%", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ originY: 1 }}
                      >
                        <motion.h3
                          className="text-xl sm:text-2xl md:text-4xl font-medium mb-2 md:mb-4 text-white"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          {project.title}
                        </motion.h3>
                        
                        <motion.p
                          className="text-xs sm:text-sm md:text-base text-gray-200 mb-4 md:mb-6 leading-relaxed line-clamp-6 max-h-32 overflow-hidden"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          {project.description}
                        </motion.p>
                        
                        <motion.div
                          className="flex gap-2 sm:gap-3 md:gap-4"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                        >
                          <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#00ffee] transition-all duration-300"
                            whileHover={{ scale: 1.3, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            title="View on GitHub"
                          >
                            <Github size={16} className="sm:w-5 sm:h-5 md:w-5 md:h-5" />
                          </motion.a>
                          
                          {project.liveUrl && (
                            <motion.a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#00ffee] transition-all duration-300"
                              whileHover={{ scale: 1.3, y: -5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => e.stopPropagation()}
                              title="View Live Demo"
                            >
                              <ExternalLink size={16} className="sm:w-5 sm:h-5 md:w-5 md:h-5" />
                            </motion.a>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection
