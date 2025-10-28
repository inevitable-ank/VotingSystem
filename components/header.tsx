"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Menu, X, User, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

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

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
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
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      {user?.username}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
