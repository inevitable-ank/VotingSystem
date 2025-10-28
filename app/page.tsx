"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PollCard } from "@/components/poll-card"
import { Header } from "@/components/header"
import { Plus, TrendingUp, Zap, Loader2 } from "lucide-react"
import { apiClient, Poll } from "@/lib/api"

// Poll interface is now imported from lib/api

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.getPolls(0, 6) // Get first 6 polls
        
        if (response.success && response.data && Array.isArray(response.data.data)) {
          setPolls(response.data.data)
        } else {
          console.warn("Invalid polls response:", response)
          setPolls([])
        }
      } catch (error) {
        console.error("Error fetching polls:", error)
        // If API fails, show empty state
        setPolls([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolls()
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
                  <p className="text-2xl font-bold">{polls?.length || 0}</p>
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
                    {(polls || []).reduce((sum, p) => sum + p.total_votes, 0).toLocaleString()}
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
              <Card key={i} className="h-64 bg-card/50 animate-pulse flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </Card>
            ))}
          </div>
        ) : polls && polls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll, index) => (
              <div key={poll.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <PollCard poll={poll} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-border/50 bg-card/50">
            <p className="text-muted-foreground mb-4">No polls available yet</p>
            <Link href="/create">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create the first one</Button>
            </Link>
          </Card>
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
