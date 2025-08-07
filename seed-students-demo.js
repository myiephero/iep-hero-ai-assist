import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

async function seedDemoStudents() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get demo parent user
    const { data: parentUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'parent@demo.com')
      .single()

    if (!parentUser) {
      console.log('Demo parent user not found, skipping student seeding')
      return
    }

    // Create demo students
    const demoStudents = [
      {
        parent_id: parentUser.id,
        first_name: 'Emma',
        last_name: 'Johnson',
        date_of_birth: '2015-03-15',
        grade_level: '3rd Grade',
        school_name: 'Lincoln Elementary School',
        school_district: 'Springfield School District',
        disabilities: ['Autism Spectrum Disorder', 'Sensory Processing Disorder'],
        current_services: ['Speech Therapy', 'Occupational Therapy'],
        iep_status: 'active'
      },
      {
        parent_id: parentUser.id,
        first_name: 'Alex',
        last_name: 'Johnson', 
        date_of_birth: '2012-08-22',
        grade_level: '6th Grade',
        school_name: 'Roosevelt Middle School',
        school_district: 'Springfield School District',
        disabilities: ['ADHD', 'Learning Disability'],
        current_services: ['Reading Support', 'Executive Function Coaching'],
        iep_status: 'active'
      }
    ]

    const { error } = await supabase
      .from('students')
      .insert(demoStudents)

    if (error) {
      console.error('Error creating demo students:', error)
    } else {
      console.log('✅ Demo students created successfully')
    }

  } catch (error) {
    console.error('Error in seedDemoStudents:', error)
  }
}

seedDemoStudents()