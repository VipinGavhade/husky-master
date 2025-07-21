"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import * as motion from "motion/react-client"
import { CheckCircle, Users, Calendar, BarChart3, ArrowRight, Play } from "lucide-react"
import { Geist_Mono as GeistMono } from "next/font/google"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const geistMono = GeistMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function Hero() {
const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error fetching user:", error)
        return
      }
      setUser(data.user)
    }

    fetchUser()
  }, [])

  if (!mounted) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const features = [
    { icon: CheckCircle, text: "Smart task prioritization" },
    { icon: Users, text: "Team collaboration tools" },
    { icon: Calendar, text: "Deadline management" },
    { icon: BarChart3, text: "Progress analytics" },
  ]

  return (
    <section className="min-h-screen px-8 bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Task Management Reimagined
              </motion.div>

              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${geistMono.className}`}>
                <span className="text-foreground">Meet</span>{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Husky</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                The intelligent task management platform that helps teams stay organized, productive, and focused on
                what matters most.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Why teams choose Husky:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-border transition-colors"
                  >
                    <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
           
           <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}${user ? "/dashboard" : "/auth/register"}`}><Button size="lg" className="group">
                {user ? "Dashboard" : "Get Started Free"} 
            
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /> </Button></Link>
              <Button variant="outline" size="lg" className="group">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className={`text-2xl font-bold text-foreground ${geistMono.className}`}>10k+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className={`text-2xl font-bold text-foreground ${geistMono.className}`}>99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className={`text-2xl font-bold text-foreground ${geistMono.className}`}>4.9★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </motion.div>
          </div>

          {/* Right Images */}
          <motion.div variants={imageVariants} className="relative">
            <div className="relative z-10">
              {/* Main Dashboard Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/20"
              >
              
                <Image
                  src={`/husky-dashboard-light.png`}
                  alt="Husky Dashboard"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
              </motion.div>

              {/* Floating Task Card */}
              <motion.div
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -right-4 top-8 bg-card border border-border rounded-xl p-4 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Task Completed</span>
                </div>
                <p className="text-xs text-muted-foreground">Design system update</p>
              </motion.div>

              {/* Floating Analytics Card */}
              <motion.div
                initial={{ opacity: 0, x: -50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -left-4 bottom-8 bg-card border border-border rounded-xl p-4 shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Productivity</span>
                </div>
                <div className={`text-lg font-bold text-green-500 ${geistMono.className}`}>+23%</div>
              </motion.div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
