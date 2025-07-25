// Generate comprehensive mock course data
// This script creates courses for all combinations of filters to ensure
// users never encounter "No courses found"

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science']
const classes = ['Kindergarten', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'Competitive Exams']
const boards = ['CBSE', 'ICSE', 'State Board', 'International']
const modes = ['online', 'offline', 'hybrid']

// Sample tutor data
const tutors = [
  { name: 'Dr. Priya Sharma', avatar: '/avatars/priya.jpg', rating: 4.9, experience: '8+ years' },
  { name: 'Prof. Rajesh Kumar', avatar: '/avatars/rajesh.jpg', rating: 4.7, experience: '12+ years' },
  { name: 'Ms. Sarah Johnson', avatar: '/avatars/sarah.jpg', rating: 4.6, experience: '5+ years' },
  { name: 'Dr. Amit Patel', avatar: '/avatars/amit.jpg', rating: 4.8, experience: '10+ years' },
  { name: 'Prof. Meera Reddy', avatar: '/avatars/meera.jpg', rating: 4.9, experience: '15+ years' },
  { name: 'Mr. Suresh Gupta', avatar: '/avatars/suresh.jpg', rating: 4.5, experience: '6+ years' },
  { name: 'Dr. Kavya Nair', avatar: '/avatars/kavya.jpg', rating: 4.8, experience: '9+ years' },
  { name: 'Prof. Arjun Singh', avatar: '/avatars/arjun.jpg', rating: 4.7, experience: '11+ years' },
  { name: 'Ms. Ritika Jain', avatar: '/avatars/ritika.jpg', rating: 4.6, experience: '7+ years' },
  { name: 'Dr. Vikram Rao', avatar: '/avatars/vikram.jpg', rating: 4.9, experience: '13+ years' }
]

// Subject-specific syllabi
const syllabi = {
  'Mathematics': [
    ['Algebra', 'Geometry', 'Trigonometry', 'Statistics'],
    ['Calculus', 'Probability', 'Coordinate Geometry', 'Mensuration'],
    ['Number Theory', 'Linear Equations', 'Quadratic Equations', 'Logarithms'],
    ['Functions', 'Sequences', 'Series', 'Matrices']
  ],
  'Physics': [
    ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics'],
    ['Waves', 'Modern Physics', 'Atomic Structure', 'Nuclear Physics'],
    ['Motion', 'Force', 'Energy', 'Gravitation'],
    ['Sound', 'Light', 'Electricity', 'Magnetism']
  ],
  'Chemistry': [
    ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
    ['Acids & Bases', 'Chemical Bonding', 'Periodic Table', 'Stoichiometry'],
    ['Reactions', 'Solutions', 'Electrochemistry', 'Thermochemistry'],
    ['Carbon Compounds', 'Metals', 'Non-Metals', 'Chemical Kinetics']
  ],
  'Biology': [
    ['Botany', 'Zoology', 'Human Physiology', 'Ecology'],
    ['Cell Biology', 'Genetics', 'Evolution', 'Biotechnology'],
    ['Plant Kingdom', 'Animal Kingdom', 'Life Processes', 'Reproduction'],
    ['Diversity', 'Classification', 'Nutrition', 'Respiration']
  ],
  'English': [
    ['Grammar', 'Literature', 'Writing Skills', 'Comprehension'],
    ['Poetry', 'Prose', 'Drama', 'Vocabulary'],
    ['Communication', 'Creative Writing', 'Essay Writing', 'Speaking Skills'],
    ['Reading Skills', 'Listening Skills', 'Presentation', 'Debate']
  ],
  'Hindi': [
    ['व्याकरण', 'गद्य', 'पद्य', 'लेखन कौशल'],
    ['कहानी', 'कविता', 'निबंध', 'पत्र लेखन'],
    ['भाषा कौशल', 'साहित्य', 'व्याकरण नियम', 'रचना'],
    ['वर्तनी', 'वाक्य निर्माण', 'अनुवाद', 'संवाद']
  ],
  'Social Studies': [
    ['History', 'Geography', 'Civics', 'Economics'],
    ['Indian History', 'World Geography', 'Government', 'Democracy'],
    ['Ancient History', 'Physical Geography', 'Constitution', 'Markets'],
    ['Medieval History', 'Human Geography', 'Rights & Duties', 'Resources']
  ],
  'Computer Science': [
    ['Programming', 'Data Structures', 'Algorithms', 'Database'],
    ['Web Development', 'Software Engineering', 'Computer Networks', 'AI'],
    ['Python', 'Java', 'HTML/CSS', 'JavaScript'],
    ['Operating Systems', 'Computer Architecture', 'Cybersecurity', 'Mobile Apps']
  ]
}

// Class-specific durations and prices
const courseDetails = {
  'Kindergarten': { duration: '3 months', priceRange: [800, 1500] },
  'Class 1-5': { duration: '4 months', priceRange: [1200, 2000] },
  'Class 6-8': { duration: '5 months', priceRange: [1800, 2800] },
  'Class 9-10': { duration: '6 months', priceRange: [2500, 3500] },
  'Class 11-12': { duration: '8 months', priceRange: [3000, 4500] },
  'Competitive Exams': { duration: '12 months', priceRange: [4000, 6000] }
}

// Locations for offline courses
const locations = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Dwarka', 'Lajpat Nagar', 'Rohini', 'Gurgaon', 'Noida', 'Faridabad'
]

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomPrice(priceRange) {
  return getRandomNumber(priceRange[0], priceRange[1])
}

function generateCourseTitle(subject, className, board) {
  const templates = [
    `Complete ${subject} for ${className}`,
    `${subject} Mastery - ${className} ${board}`,
    `Advanced ${subject} Course`,
    `${subject} Foundation for ${className}`,
    `Comprehensive ${subject} Program`,
    `${subject} Excellence Course`,
    `Master ${subject} - ${board} Curriculum`,
    `${subject} Success Program`
  ]
  
  return getRandomElement(templates)
}

function generateMockCourses() {
  const courses = []
  let courseId = 1

  // Generate courses for each combination
  subjects.forEach(subject => {
    classes.forEach(className => {
      boards.forEach(board => {
        modes.forEach(mode => {
          // Generate 1-2 courses per combination to add variety
          const numCourses = Math.random() > 0.7 ? 2 : 1
          
          for (let i = 0; i < numCourses; i++) {
            const tutor = getRandomElement(tutors)
            const syllabus = getRandomElement(syllabi[subject] || [['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4']])
            const details = courseDetails[className]
            const price = getRandomPrice(details.priceRange)
            
            const course = {
              id: courseId.toString(),
              title: generateCourseTitle(subject, className, board),
              subject: subject,
              class: className,
              board: board,
              mode: mode,
              price: price,
              duration: details.duration,
              tutor: tutor,
              syllabus: syllabus,
              aiRecommendation: Math.random() > 0.6, // 40% chance of AI recommendation
              students: getRandomNumber(15, 60),
              rating: +(4.3 + Math.random() * 0.7).toFixed(1), // 4.3 to 5.0
              reviews: getRandomNumber(8, 35)
            }

            // Add location for offline courses
            if (mode === 'offline') {
              course.location = getRandomElement(locations)
            }

            courses.push(course)
            courseId++
          }
        })
      })
    })
  })

  return courses
}

// Generate the courses
const mockCourses = generateMockCourses()

console.log(`Generated ${mockCourses.length} mock courses`)
console.log('Sample courses:')
console.log(mockCourses.slice(0, 3))

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockCourses
} else if (typeof window !== 'undefined') {
  window.mockCourses = mockCourses
}

// Function to inject courses into the frontend
function injectCoursesIntoApp() {
  return `
// Replace the hardcoded courses array in src/app/courses/page.tsx
const mockCourses = ${JSON.stringify(mockCourses, null, 2)}

// Update the useEffect in CoursesPage component:
useEffect(() => {
  // Simulate API call
  setTimeout(() => {
    setCourses(mockCourses)
    setLoading(false)
  }, 1000)
}, [])
`
}

console.log('\n=== INJECTION CODE ===')
console.log('Copy the following code to replace the courses data in src/app/courses/page.tsx:')
console.log(injectCoursesIntoApp()) 