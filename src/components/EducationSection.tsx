"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Particles from "./ui/Particles"

const EducationSection = () => {
  const educationData = [
    {
      year: "2025",
      title: "College",
      institution: "Meghnad Saha Institute of Technology, Ruby, West Bengal",
      university: "MAKAUT",
      degree: "Bachelor of Technology in Information Technology",
      grade: "CGPA: 8.77",
    },
    {
      year: "2020",
      title: "Higher Secondary Education",
      institution: "Searsole Raj High School, Raniganj, West Bengal",
      university: "The West Bengal Council of Higher Secondary Education (WBCHSE)",
      degree: "",
      grade: "Percentage: 83%",
    },
    {
      year: "2018",
      title: "Secondary Education",
      institution: "Searsole Raj High School, Raniganj, West Bengal",
      university: "West Bengal Board of Secondary Education (WBBSE)",
      degree: "",
      grade: "Percentage: 88%",
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

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="education" className="min-h-screen bg-gray-900 text-white py-32 px-6 md:px-20 relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 w-full h-full">
        <Particles
          particleCount={100}
          particleSpread={10}
          speed={0.04}
          particleColors={["#00ffee", "#ffffff", "#888888"]}
          moveParticlesOnHover={true}
          particleHoverFactor={0.4}
          alphaParticles={true}
          particleBaseSize={70}
          sizeRandomness={0.9}
          cameraDistance={16}
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="text-6xl md:text-8xl font-bold text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Education
        </motion.h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-cyan-400 hidden md:block"></div>

          <motion.div
            className="space-y-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {educationData.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-cyan-400 rounded-full shadow-[0_0_25px_#00ffee,0_0_50px_#00ffee] z-10 hidden md:block"></div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                  <Card className="bg-black border-2 border-cyan-400 shadow-[0_0_10px_#00ffee] hover:shadow-[0_0_25px_#00ffee] transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400 text-lg font-bold">
                          {item.year}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-semibold text-white mb-4">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-gray-300">
                        <p className="font-medium">{item.institution}</p>
                        <p className="text-sm">Affiliation: {item.university}</p>
                        {item.degree && <p className="text-sm">{item.degree}</p>}
                        <p className="text-cyan-400 font-semibold">{item.grade}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Year Badge for Mobile */}
                <div className="md:hidden mb-4">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400 text-xl font-bold px-4 py-2">
                    {item.year}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default EducationSection
