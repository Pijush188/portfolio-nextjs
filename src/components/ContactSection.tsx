"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, Phone, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import emailjs from "@emailjs/browser"

const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullname || !formData.email || !formData.message) {
      alert("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Initialize EmailJS (replace with your actual public key)
      emailjs.init("k_g0NlDb1xFAZj8pA")
      
      const templateParams = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      }

      // Replace with your actual service ID and template ID
      await emailjs.send('service_1le6t6a', 'template_m0tm06j', templateParams)
      
      setSubmitStatus("success")
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
      alert("Message sent successfully!")
    } catch (error) {
      console.error("Error sending email:", error)
      setSubmitStatus("error")
      alert("Failed to send the message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="contact" className="min-h-screen bg-black text-white py-32 px-6 md:px-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h2
          className="text-6xl md:text-8xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Contact <span className="text-cyan-400">Me</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className="bg-gray-900/50 border-2 border-cyan-400/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                    <Input
                      name="fullname"
                      placeholder="Full Name"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      required
                      className="pl-12 bg-gray-800 border-cyan-400 text-white placeholder:text-gray-400 focus:border-cyan-300 focus:ring-cyan-300/50 h-12 text-lg"
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-12 bg-gray-800 border-cyan-400 text-white placeholder:text-gray-400 focus:border-cyan-300 focus:ring-cyan-300/50 h-12 text-lg"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-12 bg-gray-800 border-cyan-400 text-white placeholder:text-gray-400 focus:border-cyan-300 focus:ring-cyan-300/50 h-12 text-lg"
                    />
                  </div>
                  
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                    <Input
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="pl-12 bg-gray-800 border-cyan-400 text-white placeholder:text-gray-400 focus:border-cyan-300 focus:ring-cyan-300/50 h-12 text-lg"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={8}
                    className="bg-gray-800 border-cyan-400 text-white placeholder:text-gray-400 focus:border-cyan-300 focus:ring-cyan-300/50 text-lg resize-none"
                  />
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="flex justify-center"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_25px_#00ffee] hover:shadow-[0_0_50px_#00ffee] px-12 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="mr-2" size={20} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection
