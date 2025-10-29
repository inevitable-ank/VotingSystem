"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Plus, Trash2, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function CreatePoll() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=/create`)
    }
  }, [isAuthenticated, isLoading, router])

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate
    if (!title.trim()) {
      setError("Please enter a poll title")
      setIsSubmitting(false)
      return
    }

    const validOptions = options.filter((opt) => opt.trim())
    if (validOptions.length < 2) {
      setError("Please provide at least 2 options")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await apiClient.createPoll({
        title: title.trim(),
        description: description.trim() || undefined,
        options: validOptions,
        allow_multiple: false, // Default to single choice
      })

      if (response.success && response.data) {
        router.push(`/poll/${response.data.id}`)
      } else {
        setError(response.message || "Failed to create poll")
      }
    } catch (error) {
      console.error("Error creating poll:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <div className="flex items-center justify-center h-96 text-muted-foreground">Redirecting to login…</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />

      <section className="px-4 py-12 max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8 animate-slide-in-up">
          <h1 className="text-4xl font-bold mb-2">Create a New Poll</h1>
          <p className="text-muted-foreground">Ask your community what they think</p>
        </div>

        <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Poll Title *</label>
              <Input
                placeholder="What's your question?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg h-12 bg-input border-border/50 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Make it clear and engaging</p>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Description (Optional)</label>
              <textarea
                placeholder="Add context or details about your poll..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-lg bg-input border border-border/50 focus:border-primary focus:outline-none resize-none h-24"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold">Poll Options *</label>
                <span className="text-xs text-muted-foreground">{options.length} options</span>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="bg-input border-border/50 focus:border-primary"
                      />
                    </div>
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addOption}
                className="w-full p-3 border-2 border-dashed border-border/50 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Plus className="w-5 h-5" />
                Add Another Option
              </button>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-8">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? "Creating..." : "Create Poll"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </main>
  )
}
