"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Particles from "./ui/Particles"

const SkillsSection = () => {
  const skillsData = [
    {
      category: "Programming Languages",
      skills: [
        { name: "Java", image: "/image/java.png" },
        { name: "Python", image: "/image/python.png" },
      ],
    },
    {
      category: "Technologies & Tools",
      skills: [
        { name: "Machine\nLearning", image: "/image/ml.png" },
        { name: "Deep\nLearning", image: "/image/ml.png" },
        { name: "LLMs", image: "/image/ml.png" },
        { name: "Generative\nAI", image: "/image/ml.png" },
        { name: "Flask", image: "/image/python.png" },
        { name: "FastAPI", image: "/image/python.png" },
        { name: "TensorFlow", image: "/image/ml.png" },
      ],
    },
    {
      category: "Subject of Interest",
      skills: [
        { name: "DBMS", image: "/image/dbms.png" },
        { name: "OOP", image: "/image/oop.png" },
        { name: "Computer\nNetwork", image: "/image/cn.png" },
        { name: "Operating\nSystem", image: "/image/os.png" },
      ],
    },
    {
      category: "Others",
      skills: [
        { name: "MySQL", image: "/image/mysql.png" },
        { name: "GitHub", image: "/image/github.png" },
        { name: "Statistics", image: "/image/ml.png" },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const categoryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const skillVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="skills" className="min-h-screen bg-black text-white py-32 px-6 md:px-20 relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 w-full h-full">
        <Particles
          particleCount={150}
          particleSpread={8}
          speed={0.05}
          particleColors={["#00ffee", "#ffffff", "#0099cc"]}
          moveParticlesOnHover={true}
          particleHoverFactor={0.5}
          alphaParticles={true}
          particleBaseSize={60}
          sizeRandomness={0.8}
          cameraDistance={15}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          className="text-6xl md:text-8xl font-bold text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Skills
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillsData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              variants={categoryVariants}
              className="text-center"
            >
              <motion.h3
                className="text-4xl font-medium text-white mb-8 pb-4 border-b-2 border-transparent hover:border-cyan-400 hover:text-cyan-400 hover:text-5xl hover:drop-shadow-[0_0_15px_#00ffee] transition-all duration-300 cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                {category.category}
              </motion.h3>

              <div className="flex flex-wrap justify-center items-center gap-8">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    variants={skillVariants}
                    className="flex flex-col items-center w-20 group cursor-pointer"
                    whileHover={{ scale: 1.1, y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative w-16 h-16 mb-4">
                      <motion.div
                        className="w-full h-full rounded-lg overflow-hidden group-hover:shadow-[0_0_25px_#00ffee,0_0_50px_#00ffee,0_0_100px_#00ffee] group-hover:rounded-[20%] transition-all duration-400"
                        whileHover={{ rotate: 5 }}
                      >
                        <Image
                          src={skill.image}
                          alt={skill.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain p-2"
                        />
                      </motion.div>
                    </div>
                    <p className="text-white text-sm font-medium text-center leading-tight whitespace-pre-line">
                      {skill.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection
