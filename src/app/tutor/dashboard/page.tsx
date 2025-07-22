"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function TutorDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tutor Dashboard</h1>
          <p className="text-muted-foreground">Welcome! Here you can manage your classes, students, and profile.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is your tutor dashboard. More features coming soon!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 