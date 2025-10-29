"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { PollCard } from "@/components/poll-card"
import { Search, Plus, AlertCircle, Loader2 } from "lucide-react"
import { apiClient, Poll } from "@/lib/api"

// Poll interface is now imported from lib/api

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setIsLoading(true)
        setError("")
        const response = await apiClient.getPolls()
        
        if (response.success && response.data !== undefined) {
          const data: any = response.data as any
          const list: Poll[] = Array.isArray(data) ? data : (data?.data ?? [])
          setPolls(Array.isArray(list) ? list : [])
        } else {
          setError(response.message || "Failed to load polls")
        }
      } catch (error) {
        console.error("Error fetching polls:", error)
        setError("Failed to load polls")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolls()
  }, [])

  const filteredPolls = (polls ?? []).filter(
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

        {/* Error State */}
        {error && (
          <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load polls</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Try Again
            </Button>
          </Card>
        )}

        {/* Polls Grid */}
        {!error && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-64 bg-card/50 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </Card>
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
          </>
        )}
      </section>
    </main>
  )
}
