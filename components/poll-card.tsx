"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share2 } from "lucide-react"

interface PollCardProps {
  poll: {
    id: string
    title: string
    description?: string
    options: Array<{
      id: string
      text: string
      vote_count: number
    }>
    total_votes: number
    likes_count: number
    created_at: string
  }
}

export function PollCard({ poll }: PollCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(poll.likes_count)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const getTopOption = () => {
    return poll.options.reduce((max, opt) => (opt.vote_count > max.vote_count ? opt : max))
  }

  const topOption = getTopOption()
  const topPercentage = poll.total_votes > 0 ? (topOption.vote_count / poll.total_votes) * 100 : 0

  return (
    <Link href={`/poll/${poll.id}`}>
      <Card className="h-full p-6 border-border/50 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 cursor-pointer group">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">{poll.title}</h3>
            {poll.description && <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{poll.description}</p>}
          </div>

          {/* Top Option Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Leading</span>
              <span className="text-sm font-bold text-primary">{Math.round(topPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${topPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{topOption.text}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
            <span>{poll.total_votes.toLocaleString()} votes</span>
            <span>{poll.options.length} options</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault()
                handleLike()
              }}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium">{likesCount}</span>
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium">Vote</span>
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
