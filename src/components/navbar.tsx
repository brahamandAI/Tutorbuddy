"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  BookOpen, 
  User, 
  GraduationCap, 
  Brain, 
  MapPin, 
  MessageSquare,
  Menu,
  X,
  Home,
  Users,
  Target,
  Settings,
  LogOut,
  Video // Add Video icon for online teaching
} from 'lucide-react'
import { useState } from 'react'
import { useAuthPopup } from '@/hooks/useAuthPopup'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openPopup } = useAuthPopup()

  const mainNavigation = [
    { name: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Courses', href: '/courses', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'AI Teaching', href: '/ai-teaching', icon: <Brain className="h-4 w-4" /> }
  ]

  const toolsNavigation = [
    { name: 'Learning Tools', href: '/learning-tools', icon: <Target className="h-4 w-4" /> },
    { name: 'Study Groups', href: '/study-groups', icon: <Users className="h-4 w-4" /> }
  ]

  const otherNavigation = [
    { name: 'Offline Meet', href: '/offline-meet', icon: <MapPin className="h-4 w-4" /> },
    { name: 'Online Teaching', href: '/study-groups', icon: <Video className="h-4 w-4" /> }, // Add Online Teaching link
    { name: 'Contact', href: '/contact', icon: <MessageSquare className="h-4 w-4" /> }
  ]



  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src="/images/logo.jpeg" 
                alt="TutorBuddy Logo" 
                className="h-16 w-auto rounded-lg"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                TutorBuddy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Main Navigation */}
            <div className="flex items-center space-x-6">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Target className="h-4 w-4" />
                <span>Tools</span>
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {toolsNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Navigation */}
            <div className="flex items-center space-x-6">
              {otherNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openPopup('register')}
                className="hover:bg-primary/10"
              >
                <User className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
              <Button 
                size="sm" 
                onClick={() => openPopup('login')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              {/* Main Navigation */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Main
                </h3>
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Tools Navigation */}
              <div className="space-y-1 pt-4 border-t">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Learning Tools
                </h3>
                {toolsNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Other Navigation */}
              <div className="space-y-1 pt-4 border-t">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Other
                </h3>
                {otherNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Auth Links */}
              <div className="space-y-1 pt-4 border-t">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Get Started
                </h3>
                <button
                  onClick={() => {
                    openPopup('register');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                >
                  <User className="h-4 w-4" />
                  <span>Sign Up</span>
                </button>
                <button
                  onClick={() => {
                    openPopup('login');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              </div>

              {/* Theme Toggle */}
              <div className="pt-4 border-t">
                <div className="px-3">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 