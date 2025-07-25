// Verification script to ensure filter combinations work
const mockCourses = require('./generate-mock-courses.js')

function testFilterCombination(subject, className, board, mode) {
  const filtered = mockCourses.filter(course => 
    course.subject === subject &&
    course.class === className &&
    course.board === board &&
    course.mode === mode
  )
  return filtered.length
}

// Test the specific combination that was causing issues
console.log('🔍 Testing specific filter combination that was failing:')
console.log('Physics + Class 6-8 + ICSE + Online')

const physicsCount = testFilterCombination('Physics', 'Class 6-8', 'ICSE', 'online')
console.log(`Found ${physicsCount} courses matching: Physics, Class 6-8, ICSE, online`)

if (physicsCount > 0) {
  console.log('✅ SUCCESS: Users will now find courses for this combination!')
  
  // Show sample course
  const sampleCourse = mockCourses.find(course => 
    course.subject === 'Physics' &&
    course.class === 'Class 6-8' &&
    course.board === 'ICSE' &&
    course.mode === 'online'
  )
  
  console.log('\n📚 Sample course for this combination:')
  console.log(`Title: ${sampleCourse.title}`)
  console.log(`Tutor: ${sampleCourse.tutor.name}`)
  console.log(`Price: ₹${sampleCourse.price}`)
  console.log(`Duration: ${sampleCourse.duration}`)
} else {
  console.log('❌ FAILED: Still no courses for this combination')
}

console.log('\n🧪 Testing other popular combinations:')

const testCombinations = [
  ['Mathematics', 'Class 9-10', 'CBSE', 'online'],
  ['English', 'Class 6-8', 'ICSE', 'offline'],
  ['Biology', 'Competitive Exams', 'CBSE', 'hybrid'],
  ['Computer Science', 'Class 11-12', 'CBSE', 'online'],
  ['Chemistry', 'Class 1-5', 'State Board', 'online']
]

testCombinations.forEach(([subject, className, board, mode]) => {
  const count = testFilterCombination(subject, className, board, mode)
  const status = count > 0 ? '✅' : '❌'
  console.log(`${status} ${subject} + ${className} + ${board} + ${mode}: ${count} courses`)
})

console.log('\n📊 Overall Statistics:')
console.log(`Total courses generated: ${mockCourses.length}`)

// Count unique combinations
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science']
const classes = ['Kindergarten', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'Competitive Exams']
const boards = ['CBSE', 'ICSE', 'State Board', 'International']
const modes = ['online', 'offline', 'hybrid']

let filledCombinations = 0
let totalCombinations = subjects.length * classes.length * boards.length * modes.length

subjects.forEach(subject => {
  classes.forEach(className => {
    boards.forEach(board => {
      modes.forEach(mode => {
        if (testFilterCombination(subject, className, board, mode) > 0) {
          filledCombinations++
        }
      })
    })
  })
})

console.log(`Filter combinations covered: ${filledCombinations}/${totalCombinations} (${(filledCombinations/totalCombinations*100).toFixed(1)}%)`)

if (filledCombinations === totalCombinations) {
  console.log('🎉 PERFECT: All filter combinations are covered!')
} else {
  console.log('⚠️  Some combinations still missing, but this should be rare edge cases.')
} 