"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient, Poll, User, Vote } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { AlertCircle, Loader2, Trash2, Pencil, CheckCircle2, XCircle } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  const [polls, setPolls] = useState<Poll[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [likes, setLikes] = useState<any[]>([])
  const [tab, setTab] = useState<"details" | "polls" | "votes" | "likes">("details")
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")

  // Edit state for a poll
  const [editingPollId, setEditingPollId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=/profile`)
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      try {
        setLoadingData(true)
        setError("")
        const [pollsRes, votesRes, likesRes] = await Promise.all([
          apiClient.getUserPolls(user.id),
          apiClient.getUserVotes(user.id),
          apiClient.getUserLikes(user.id),
        ])
        if (pollsRes.success) {
          const data = Array.isArray(pollsRes.data) ? pollsRes.data : pollsRes.data?.data
          setPolls(Array.isArray(data) ? data : [])
        } else {
          setError(pollsRes.message || "Failed to load polls")
        }
        if (votesRes.success && votesRes.data) {
          setVotes(votesRes.data.data || [])
        }
        if (likesRes.success && likesRes.data) {
          setLikes(likesRes.data.data || [])
        }
      } catch (e) {
        console.error(e)
        setError("Failed to load profile data")
      } finally {
        setLoadingData(false)
      }
    }
    if (user) load()
  }, [user])

  const startEdit = (poll: Poll) => {
    setEditingPollId(poll.id)
    setEditTitle(poll.title)
    setEditDescription(poll.description || "")
  }

  const cancelEdit = () => {
    setEditingPollId(null)
    setEditTitle("")
    setEditDescription("")
  }

  const saveEdit = async () => {
    if (!editingPollId) return
    try {
      setIsSaving(true)
      const res = await apiClient.updatePoll(editingPollId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      })
      if (res.success && res.data) {
        setPolls((prev) => prev.map((p) => (p.id === editingPollId ? { ...p, ...res.data } : p)))
        cancelEdit()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const deletePoll = async (pollId: string) => {
    if (!confirm("Delete this poll? This cannot be undone.")) return
    const res = await apiClient.deletePoll(pollId)
    if (res.success) {
      setPolls((prev) => prev.filter((p) => p.id !== pollId))
    }
  }

  const toggleActive = async (poll: Poll) => {
    const res = poll.is_active ? await apiClient.deactivatePoll(poll.id) : await apiClient.activatePoll(poll.id)
    if (res.success) {
      setPolls((prev) => prev.map((p) => (p.id === poll.id ? { ...p, is_active: !poll.is_active } : p)))
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          {isLoading ? (
            <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin"/> Loading…</div>
          ) : (
            "Redirecting to login…"
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">My Profile</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button variant={tab === "details" ? "default" : "outline"} onClick={() => setTab("details")}>Details</Button>
          <Button variant={tab === "polls" ? "default" : "outline"} onClick={() => setTab("polls")}>My Polls</Button>
          <Button variant={tab === "votes" ? "default" : "outline"} onClick={() => setTab("votes")}>My Votes</Button>
          <Button variant={tab === "likes" ? "default" : "outline"} onClick={() => setTab("likes")}>My Likes</Button>
        </div>

        {error && (
          <Card className="p-6 mb-6 border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2 text-destructive"><AlertCircle className="w-5 h-5"/> {error}</div>
          </Card>
        )}

        {tab === "details" && (
          <Card className="p-8 border-border/50 bg-card/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div className="text-lg font-semibold">{user?.username}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-lg font-semibold">{user?.email || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="text-lg font-semibold">{user?.is_active ? "Active" : "Inactive"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Member Since</div>
                <div className="text-lg font-semibold">{user?.created_at ? new Date(user.created_at).toLocaleString() : "-"}</div>
              </div>
            </div>
          </Card>
        )}

        {tab === "polls" && (
          <div className="space-y-4">
            {loadingData ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin"/> Loading polls…</div>
            ) : polls.length === 0 ? (
              <Card className="p-8 text-center border-border/50 bg-card/50">You haven't created any polls yet.</Card>
            ) : (
              polls.map((p) => (
                <Card key={p.id} className="p-6 border-border/50 bg-card/50">
                  {editingPollId === p.id ? (
                    <div className="space-y-3">
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
                      <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} disabled={isSaving} className="gap-2"><CheckCircle2 className="w-4 h-4"/> Save</Button>
                        <Button variant="outline" onClick={cancelEdit} className="gap-2"><XCircle className="w-4 h-4"/> Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="text-xl font-semibold">{p.title}</div>
                        {p.description && <div className="text-muted-foreground">{p.description}</div>}
                        <div className="text-sm text-muted-foreground mt-2 flex gap-3">
                          <span>{p.total_votes} votes</span>
                          <span>•</span>
                          <span>{p.likes_count} likes</span>
                          <span>•</span>
                          <span>{p.is_active ? "Active" : "Inactive"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => startEdit(p)}><Pencil className="w-4 h-4"/> Edit</Button>
                        <Button variant="outline" className="gap-2" onClick={() => toggleActive(p)}>
                          {p.is_active ? (<><XCircle className="w-4 h-4"/> Deactivate</>) : (<><CheckCircle2 className="w-4 h-4"/> Activate</>)}
                        </Button>
                        <Button variant="destructive" className="gap-2" onClick={() => deletePoll(p.id)}><Trash2 className="w-4 h-4"/> Delete</Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {tab === "votes" && (
          <Card className="p-6 border-border/50 bg-card/50">
            {loadingData ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin"/> Loading votes…</div>
            ) : votes.length === 0 ? (
              <div className="text-center text-muted-foreground">No votes yet.</div>
            ) : (
              <ul className="space-y-2">
                {votes.map((v) => (
                  <li key={v.id} className="flex items-center justify-between">
                    <span>Voted on poll {v.poll_id}</span>
                    <span className="text-sm text-muted-foreground">{new Date(v.created_at).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {tab === "likes" && (
          <Card className="p-6 border-border/50 bg-card/50">
            {loadingData ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin"/> Loading likes…</div>
            ) : likes.length === 0 ? (
              <div className="text-center text-muted-foreground">No likes yet.</div>
            ) : (
              <ul className="space-y-2">
                {likes.map((l) => (
                  <li key={l.id} className="flex items-center justify-between">
                    <span>Liked poll {l.poll_id}</span>
                    <span className="text-sm text-muted-foreground">{l.created_at ? new Date(l.created_at).toLocaleString() : ""}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </section>
    </main>
  )
}
