import * as motion from "motion/react-client"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor?: string
  gradientFrom?: string
  gradientTo?: string
  delay?: number
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-white",
  gradientFrom = "from-teal-400",
  gradientTo = "to-teal-600",
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="w-full h-80 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 dark:hover:shadow-gray-800/60 transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        {/* Icon with glow effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          className="mb-6"
        >
          <div
            className={`w-16 h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center shadow-lg dark:shadow-gray-900/50`}
          >
            <Icon className={`w-8 h-8 ${iconColor}`} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4, duration: 0.6 }}
          className="text-xl font-bold text-gray-900 dark:text-white mb-3"
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.6, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  )
}
