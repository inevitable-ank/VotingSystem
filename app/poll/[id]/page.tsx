"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Heart, Share2, ArrowLeft, MessageCircle, AlertCircle, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { apiClient, Poll, VoteStats } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

// Poll and Option interfaces are now imported from lib/api

const CHART_COLORS = ["#7c3aed", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"]

export default function PollDetail() {
  const params = useParams()
  const pollId = params.id as string
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setIsLoading(true)
        setError("")
        const response = await apiClient.getPoll(pollId)
        
        if (response.success && response.data) {
          setPoll(response.data)
          setLikesCount(response.data.likes_count)
        } else {
          setError(response.message || "Failed to load poll")
        }
      } catch (error) {
        console.error("Error fetching poll:", error)
        setError("Failed to load poll")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPoll()
  }, [pollId])

  const handleVote = async () => {
    if (!selectedOption || hasVoted || !poll) return

    if (!isAuthenticated) {
      router.replace(`/login?next=/poll/${pollId}`)
      return
    }

    setIsVoting(true)
    try {
      const response = await apiClient.castVote(pollId, [selectedOption])
      
      if (response.success && response.data) {
        // Refresh poll data to get updated vote counts
        const pollResponse = await apiClient.getPoll(pollId)
        if (pollResponse.success && pollResponse.data) {
          setPoll(pollResponse.data)
        }
        setHasVoted(true)
      } else {
        setError(response.message || "Failed to cast vote")
      }
    } catch (error) {
      console.error("Error casting vote:", error)
      setError("Failed to cast vote")
    } finally {
      setIsVoting(false)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading poll...
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load poll</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Try Again
            </Button>
          </Card>
        </div>
      </main>
    )
  }

  if (!poll) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Poll not found</div>
        </div>
      </main>
    )
  }

  const chartData = poll.options.map((opt) => ({
    name: opt.text,
    votes: opt.vote_count,
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />

      <section className="px-4 py-12 max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Polls
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Poll Header */}
            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
              <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
              {poll.description && <p className="text-muted-foreground mb-6">{poll.description}</p>}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{poll.total_votes.toLocaleString()} votes</span>
                <span>•</span>
                <span>{poll.options.length} options</span>
              </div>
            </Card>

            {/* Voting Options */}
            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm space-y-6">
              <h2 className="text-xl font-bold">Cast Your Vote</h2>

              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percentage = poll.total_votes > 0 ? (option.vote_count / poll.total_votes) * 100 : 0
                  const isSelected = selectedOption === option.id

                  return (
                    <button
                      key={option.id}
                      onClick={() => !hasVoted && setSelectedOption(option.id)}
                      disabled={hasVoted}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left group ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
                      } ${hasVoted ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm font-bold text-primary">{Math.round(percentage)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {option.vote_count.toLocaleString()} votes
                      </div>
                    </button>
                  )
                })}
              </div>

              {!hasVoted && (
                <Button
                  onClick={handleVote}
                  disabled={!selectedOption || isVoting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                >
                  {isVoting ? "Submitting..." : "Submit Vote"}
                </Button>
              )}

              {hasVoted && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
                  <p className="text-sm font-medium text-primary">✓ Your vote has been recorded</p>
                </div>
              )}
            </Card>

            {/* Chart */}
            <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6">Results Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm space-y-3">
              <button
                onClick={handleLike}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors border border-border/50"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                <span className="font-medium">{likesCount} Likes</span>
              </button>

              <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors border border-border/50">
                <Share2 className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Share</span>
              </button>

              <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors border border-border/50">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Comments</span>
              </button>
            </Card>

            {/* Poll Info */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm space-y-4">
              <h3 className="font-bold">Poll Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Votes</p>
                  <p className="font-bold text-lg">{poll.total_votes.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Options</p>
                  <p className="font-bold text-lg">{poll.options.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-bold text-lg text-primary">Active</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
