"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, BookOpen, TrendingUp, Star, Video, MessageSquare } from 'lucide-react'

interface Booking {
  id: string
  tutorName: string
  subject: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  tutorAvatar: string
}

interface Progress {
  subject: string
  improvement: number
  sessionsCompleted: number
  totalSessions: number
}

export default function StudentDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings([
        {
          id: '1',
          tutorName: 'Dr. Sarah Johnson',
          subject: 'Mathematics',
          date: '2024-01-15',
          time: '14:00',
          status: 'upcoming',
          tutorAvatar: '/avatars/sarah.jpg'
        },
        {
          id: '2',
          tutorName: 'Prof. Michael Chen',
          subject: 'Chemistry',
          date: '2024-01-12',
          time: '16:00',
          status: 'completed',
          tutorAvatar: '/avatars/michael.jpg'
        },
        {
          id: '3',
          tutorName: 'Emma Rodriguez',
          subject: 'English',
          date: '2024-01-10',
          time: '10:00',
          status: 'completed',
          tutorAvatar: '/avatars/emma.jpg'
        }
      ])

      setProgress([
        {
          subject: 'Mathematics',
          improvement: 25,
          sessionsCompleted: 8,
          totalSessions: 12
        },
        {
          subject: 'Chemistry',
          improvement: 15,
          sessionsCompleted: 5,
          totalSessions: 8
        },
        {
          subject: 'English',
          improvement: 30,
          sessionsCompleted: 6,
          totalSessions: 10
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming')
  const completedBookings = bookings.filter(booking => booking.status === 'completed')

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Next session in 2 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently studying
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled tutoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map(booking => (
                    <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={booking.tutorAvatar} alt={booking.tutorName} />
                        <AvatarFallback>{booking.tutorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{booking.tutorName}</h4>
                        <p className="text-sm text-muted-foreground">{booking.subject}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                          <Clock className="h-3 w-3" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
          </Button>
        </div>
      </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming sessions</p>
                  <Button className="mt-4">Book a Session</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your improvement across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject.subject}</span>
                      <span className="text-sm text-muted-foreground">
                        {subject.sessionsCompleted}/{subject.totalSessions} sessions
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(subject.sessionsCompleted / subject.totalSessions) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-green-600">+{subject.improvement}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest tutoring sessions and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedBookings.map(booking => (
                <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.tutorAvatar} alt={booking.tutorName} />
                    <AvatarFallback>{booking.tutorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">Session with {booking.tutorName}</h4>
                    <p className="text-sm text-muted-foreground">{booking.subject} • {new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 