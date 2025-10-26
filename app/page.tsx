"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PollCard } from "@/components/poll-card"
import { Header } from "@/components/header"
import { Plus, TrendingUp, Zap } from "lucide-react"

interface Poll {
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

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching polls from backend
    const mockPolls: Poll[] = [
      {
        id: "1",
        title: "What's your favorite programming language?",
        description: "Help us understand the developer community preferences",
        options: [
          { id: "opt1", text: "TypeScript", vote_count: 342 },
          { id: "opt2", text: "Python", vote_count: 289 },
          { id: "opt3", text: "Go", vote_count: 156 },
          { id: "opt4", text: "Rust", vote_count: 213 },
        ],
        total_votes: 1000,
        likes_count: 234,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        title: "Best time for a standup meeting?",
        description: "When do you prefer to have your team standup?",
        options: [
          { id: "opt1", text: "9:00 AM", vote_count: 156 },
          { id: "opt2", text: "10:00 AM", vote_count: 289 },
          { id: "opt3", text: "2:00 PM", vote_count: 78 },
          { id: "opt4", text: "No preference", vote_count: 145 },
        ],
        total_votes: 668,
        likes_count: 89,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        title: "Remote or Office work?",
        description: "What's your ideal work setup?",
        options: [
          { id: "opt1", text: "Fully Remote", vote_count: 512 },
          { id: "opt2", text: "Hybrid", vote_count: 378 },
          { id: "opt3", text: "Office", vote_count: 110 },
        ],
        total_votes: 1000,
        likes_count: 456,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    setTimeout(() => {
      setPolls(mockPolls)
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-in-up">
            <h1 className="text-5xl sm:text-6xl font-bold text-balance mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Real-Time Polling
              </span>
              <br />
              <span className="text-foreground">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create engaging polls, gather opinions instantly, and watch results update live as your community votes.
            </p>
            <Link href="/create">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-5 h-5" />
                Create Your First Poll
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Polls</p>
                  <p className="text-2xl font-bold">{polls.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                  <p className="text-2xl font-bold">
                    {polls.reduce((sum, p) => sum + p.total_votes, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Plus className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Community</p>
                  <p className="text-2xl font-bold">2.5K+</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Polls Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Trending Polls</h2>
          <p className="text-muted-foreground">Vote on what matters to you</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll, index) => (
              <div key={poll.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <PollCard poll={poll} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <Card className="p-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Create your first poll in seconds and start gathering real-time feedback from your community.
          </p>
          <Link href="/create">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create a Poll Now
            </Button>
          </Link>
        </Card>
      </section>
    </main>
  )
}
