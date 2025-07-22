"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Monitor, 
  MapPin, 
  Phone, 
  Mail, 
  Upload,
  CheckCircle,
  ArrowLeft,
  Brain,
  Smartphone,
  School,
  Target,
  Trophy,
  Award
} from 'lucide-react'
import Link from 'next/link'

export default function StudentRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '', // changed from class to grade
    subjects: [] as string[],
    mode: '',
    area: '',
    contact: '',
    email: '',
    password: '', // add password field
    profilePicture: null as File | null
  })

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const classOptions = [
    { value: 'kg', label: 'Kindergarten' },
    { value: '1', label: 'Class 1' },
    { value: '2', label: 'Class 2' },
    { value: '3', label: 'Class 3' },
    { value: '4', label: 'Class 4' },
    { value: '5', label: 'Class 5' },
    { value: '6', label: 'Class 6' },
    { value: '7', label: 'Class 7' },
    { value: '8', label: 'Class 8' },
    { value: '9', label: 'Class 9' },
    { value: '10', label: 'Class 10' },
    { value: '11', label: 'Class 11' },
    { value: '12', label: 'Class 12' },
    { value: 'jee', label: 'JEE Aspirant' },
    { value: 'neet', label: 'NEET Aspirant' },
    { value: 'other', label: 'Other Competitive Exams' }
  ]

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'physics', label: 'Physics', icon: <Target className="h-4 w-4" /> },
    { value: 'chemistry', label: 'Chemistry', icon: <Award className="h-4 w-4" /> },
    { value: 'biology', label: 'Biology', icon: <School className="h-4 w-4" /> },
    { value: 'english', label: 'English', icon: <GraduationCap className="h-4 w-4" /> },
    { value: 'hindi', label: 'Hindi', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'social-studies', label: 'Social Studies', icon: <MapPin className="h-4 w-4" /> },
    { value: 'computer-science', label: 'Computer Science', icon: <Monitor className="h-4 w-4" /> }
  ]

  const delhiAreas = [
    'Lajpat Nagar', 'Rohini', 'Dwarka', 'Saket', 'Pitampura', 'Janakpuri',
    'Rajouri Garden', 'Kirti Nagar', 'Patel Nagar', 'Karol Bagh', 'Connaught Place',
    'Greater Kailash', 'Defence Colony', 'Hauz Khas', 'Green Park', 'Vasant Vihar'
  ]

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'STUDENT',
          grade: formData.grade,
          subjects: formData.subjects
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="w-full mb-6 rounded-lg bg-primary/10 px-6 py-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">
              Already have an account?
            </span>
            <Link href="/login" className="text-primary font-bold underline text-lg hover:text-primary/80 transition">
              Login here
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Student Registration</h1>
            <p className="text-muted-foreground">Join our AI-powered learning platform</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Personal Information"}
              {step === 2 && "Academic Details"}
              {step === 3 && "Contact & Preferences"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "What would you like to learn?"}
              {step === 3 && "How can we reach you?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">Registration successful! Please log in.</div>}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : undefined} />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Age</label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Enter your age"
                      min="3"
                      max="25"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Grade (was Class) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Grade/Level</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    >
                      <option value="">Select your grade</option>
                      {classOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Subjects */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Subjects</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {subjectOptions.map(subject => (
                        <div
                          key={subject.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.subjects.includes(subject.value)
                              ? 'border-primary bg-primary/10'
                              : 'border-input hover:border-primary/50'
                          }`}
                          onClick={() => handleSubjectToggle(subject.value)}
                        >
                          <div className="flex items-center space-x-2">
                            {subject.icon}
                            <span className="text-sm">{subject.label}</span>
                            {formData.subjects.includes(subject.value) && (
                              <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Mode */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Learning Mode</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.mode === 'online'
                            ? 'border-primary bg-primary/10'
                            : 'border-input hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, mode: 'online' }))}
                      >
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-5 w-5" />
                          <div>
                            <div className="font-medium">Online</div>
                            <div className="text-sm text-muted-foreground">Virtual classes</div>
                          </div>
                          {formData.mode === 'online' && (
                            <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                          )}
                        </div>
                      </div>
                      
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.mode === 'offline'
                            ? 'border-primary bg-primary/10'
                            : 'border-input hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, mode: 'offline' }))}
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5" />
                          <div>
                            <div className="font-medium">Offline</div>
                            <div className="text-sm text-muted-foreground">In-person sessions</div>
                          </div>
                          {formData.mode === 'offline' && (
                            <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* Area in Delhi */}
                  {formData.mode === 'offline' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Area in Delhi</label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        required
                      >
                        <option value="">Select your preferred area</option>
                        {delhiAreas.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Number</label>
                    <Input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  {/* AI Features Info */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <span className="font-medium">AI-Powered Learning Features</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Personalized learning recommendations</div>
                      <div>• 24/7 AI chatbot support</div>
                      <div>• Voice assistance in Indian languages</div>
                      <div>• Smart progress tracking</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={
                      (step === 1 && (!formData.name || !formData.age)) ||
                      (step === 2 && (!formData.grade || formData.subjects.length === 0 || !formData.mode))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 