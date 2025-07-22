"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
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
  Award,
  Clock,
  Star,
  Target,
  School,
  Trophy,
  Briefcase,
  FileText,
  Languages
} from 'lucide-react'
import Link from 'next/link'

export default function TutorRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    qualifications: '',
    subjects: [] as string[],
    mode: '',
    location: '',
    experience: '',
    profilePicture: null as File | null,
    email: '',
    password: '', // <-- Add password field
    contact: '',
    bio: '',
    hourlyRate: '',
    languages: [] as string[]
  })

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const qualificationOptions = [
    'B.Tech/B.E.', 'M.Tech/M.E.', 'B.Sc.', 'M.Sc.', 'B.A.', 'M.A.', 'Ph.D.',
    'B.Ed.', 'M.Ed.', 'CA', 'CS', 'ICWA', 'MBA', 'MBBS', 'BDS', 'Other'
  ]

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'physics', label: 'Physics', icon: <Target className="h-4 w-4" /> },
    { value: 'chemistry', label: 'Chemistry', icon: <Award className="h-4 w-4" /> },
    { value: 'biology', label: 'Biology', icon: <School className="h-4 w-4" /> },
    { value: 'english', label: 'English', icon: <GraduationCap className="h-4 w-4" /> },
    { value: 'hindi', label: 'Hindi', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'social-studies', label: 'Social Studies', icon: <MapPin className="h-4 w-4" /> },
    { value: 'computer-science', label: 'Computer Science', icon: <Monitor className="h-4 w-4" /> },
    { value: 'economics', label: 'Economics', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'accountancy', label: 'Accountancy', icon: <FileText className="h-4 w-4" /> },
    { value: 'commerce', label: 'Commerce', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'competitive-exams', label: 'Competitive Exams', icon: <Trophy className="h-4 w-4" /> }
  ]

  const delhiLocations = [
    'Lajpat Nagar', 'Rohini', 'Dwarka', 'Saket', 'Pitampura', 'Janakpuri',
    'Rajouri Garden', 'Kirti Nagar', 'Patel Nagar', 'Karol Bagh', 'Connaught Place',
    'Greater Kailash', 'Defence Colony', 'Hauz Khas', 'Green Park', 'Vasant Vihar'
  ]

  const experienceOptions = [
    '0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'
  ]

  const languageOptions = [
    'English', 'Hindi', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali', 'Tamil', 'Telugu'
  ]

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
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
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: 'TUTOR'
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Tutor Registration</h1>
            <p className="text-muted-foreground">Join our platform as an expert tutor</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
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
              {step === 2 && "Qualifications & Subjects"}
              {step === 3 && "Teaching Preferences"}
              {step === 4 && "Contact & Bio"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Your educational background and expertise"}
              {step === 3 && "How would you like to teach?"}
              {step === 4 && "How can students reach you?"}
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

                  {/* Contact */}
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
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Qualifications */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Highest Qualification</label>
                    <select
                      value={formData.qualifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    >
                      <option value="">Select your qualification</option>
                      {qualificationOptions.map(qual => (
                        <option key={qual} value={qual}>{qual}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Teaching Experience</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    >
                      <option value="">Select your experience</option>
                      {experienceOptions.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subjects Taught */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Subjects You Can Teach</label>
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
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* Teaching Mode */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Teaching Mode</label>
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

                  {/* Location */}
                  {formData.mode === 'offline' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Location in Delhi</label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        required
                      >
                        <option value="">Select your preferred location</option>
                        {delhiLocations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Hourly Rate */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate (₹)</label>
                    <Input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                      placeholder="Enter your hourly rate"
                      min="100"
                      required
                    />
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Languages You Can Teach In</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {languageOptions.map(language => (
                        <div
                          key={language}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.languages.includes(language)
                              ? 'border-primary bg-primary/10'
                              : 'border-input hover:border-primary/50'
                          }`}
                          onClick={() => handleLanguageToggle(language)}
                        >
                          <div className="flex items-center space-x-2">
                            <Languages className="h-4 w-4" />
                            <span className="text-sm">{language}</span>
                            {formData.languages.includes(language) && (
                              <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Teaching Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell students about your teaching style, experience, and what makes you unique..."
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  {/* AI Teaching Assistant Info */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <span className="font-medium">AI Teaching Assistant Features</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• AI-powered lesson planning and content creation</div>
                      <div>• Smart assessment and progress tracking</div>
                      <div>• Voice and video lesson support</div>
                      <div>• Multilingual teaching assistance</div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="font-medium">Verified Profile</div>
                      <div className="text-sm text-muted-foreground">Build trust with students</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="font-medium">Flexible Schedule</div>
                      <div className="text-sm text-muted-foreground">Teach on your own time</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="font-medium">Earn More</div>
                      <div className="text-sm text-muted-foreground">Set your own rates</div>
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
                
                {step < 4 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={
                      (step === 1 && (!formData.name || !formData.email || !formData.password || !formData.contact)) ||
                      (step === 2 && (!formData.qualifications || !formData.experience || formData.subjects.length === 0)) ||
                      (step === 3 && (!formData.mode || !formData.hourlyRate || formData.languages.length === 0))
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