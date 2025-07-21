import * as motion from "motion/react-client"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TestimonialCardProps {
  quote: string
  userName: string
  userEmail: string
  rating: number
  userImage?: string
  index?: number
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  )
}

export default function TestimonialCard({
  quote,
  userName,
  userEmail,
  rating,
  userImage,
  index = 0,
}: TestimonialCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      whileHover={{
        rotate: 2,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className="h-full"
    >
      <Card className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Quote */}
          <div className="flex-1 mb-6">
            <blockquote className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">"{quote}"</blockquote>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <StarRating rating={rating} />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
              <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{userName}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{userEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
