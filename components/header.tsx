"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">QuickPoll</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/polls" className="text-sm font-medium hover:text-primary transition-colors">
            Explore
          </Link>
          <Link href="/create" className="text-sm font-medium hover:text-primary transition-colors">
            Create
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/create">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create Poll</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border/50 md:hidden">
            <nav className="flex flex-col gap-4 p-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/polls" className="text-sm font-medium hover:text-primary transition-colors">
                Explore
              </Link>
              <Link href="/create" className="text-sm font-medium hover:text-primary transition-colors">
                Create
              </Link>
              <Link href="/create" className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Create Poll</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
