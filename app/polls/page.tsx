"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { PollCard } from "@/components/poll-card"
import { Search, Plus } from "lucide-react"

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

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching polls
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

  const filteredPolls = polls.filter(
    (poll) =>
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />

      <section className="px-4 py-12 max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Explore Polls</h1>
          <p className="text-muted-foreground">Discover and vote on trending polls</p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search polls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border/50 focus:border-primary"
            />
          </div>
          <Link href="/create">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-5 h-5" />
              Create
            </Button>
          </Link>
        </div>

        {/* Polls Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64 bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : filteredPolls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll, index) => (
              <div key={poll.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <PollCard poll={poll} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-border/50 bg-card/50">
            <p className="text-muted-foreground mb-4">No polls found matching your search</p>
            <Link href="/create">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create the first one</Button>
            </Link>
          </Card>
        )}
      </section>
    </main>
  )
}
