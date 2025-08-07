// Demo goal seeding script for Goal Tracker testing
const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const { eq } = require("drizzle-orm");
const { randomUUID } = require("crypto");

// Import schemas - you'll need to adjust these imports based on your structure
const { iepGoals, users, students } = require("./shared/schema");

async function seedDemoGoals() {
  // Create database connection
  const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/postgres';
  const sql = postgres(connectionString);
  const db = drizzle(sql);

  try {
    console.log('🌱 Seeding demo goals for Goal Tracker...');

    // Find parent@demo.com user
    const [parentUser] = await db.select().from(users).where(eq(users.email, 'parent@demo.com'));
    if (!parentUser) {
      console.log('❌ Parent demo user not found');
      return;
    }

    // Find students for this parent (or create one if none exists)
    let studentList = await db.select().from(students).where(eq(students.parentId, parentUser.id));
    
    if (studentList.length === 0) {
      // Create a demo student
      const demoStudent = await db.insert(students).values({
        id: randomUUID(),
        firstName: 'Emma',
        lastName: 'Johnson',
        gradeLevel: '3rd Grade',
        schoolName: 'Riverside Elementary',
        parentId: parentUser.id,
        advocateId: null,
        dateOfBirth: '2015-08-15',
        iepStartDate: '2024-09-01',
        iepEndDate: '2025-08-31',
        disabilityCategories: ['Autism Spectrum Disorder'],
        strengths: 'Strong visual learner, loves reading',
        challenges: 'Social communication, transitions',
        accommodations: 'Visual schedule, sensory breaks',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      studentList = demoStudent;
      console.log('✅ Created demo student: Emma Johnson');
    }

    const studentId = studentList[0].id;

    // Check if goals already exist for this student
    const existingGoals = await db.select().from(iepGoals).where(eq(iepGoals.studentId, studentId));
    
    if (existingGoals.length > 0) {
      console.log('✅ Demo goals already exist for student');
      await sql.end();
      return;
    }

    // Create demo IEP goals
    const demoGoals = [
      {
        id: randomUUID(),
        userId: parentUser.id,
        studentId: studentId,
        title: 'Reading Comprehension Progress',
        description: 'Emma will read grade-level texts and answer comprehension questions with 80% accuracy across 4 out of 5 consecutive sessions.',
        category: 'academic',
        status: 'In Progress',
        progress: 65,
        targetDate: '2025-05-30',
        dueDate: '2025-05-30',
        domain: 'Reading',
        measurableObjectives: ['Read 3rd grade level texts', 'Answer who, what, when, where questions', 'Demonstrate understanding through discussion'],
        accommodations: ['Extended time', 'Visual supports', 'Small group setting'],
        dataCollectionMethod: 'Weekly running records and comprehension assessments',
        baseline: 'Currently reading at 2nd grade level with 45% comprehension accuracy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        userId: parentUser.id,
        studentId: studentId,
        title: 'Social Communication Skills',
        description: 'Emma will initiate appropriate social interactions with peers during structured activities for 3 out of 5 opportunities across 3 consecutive weeks.',
        category: 'social-emotional',
        status: 'In Progress',
        progress: 45,
        targetDate: '2025-04-15',
        dueDate: '2025-04-15',
        domain: 'Communication',
        measurableObjectives: ['Use appropriate greetings', 'Ask peers to join activities', 'Respond to social initiations from others'],
        accommodations: ['Visual social scripts', 'Peer buddy system', 'Pre-teaching social situations'],
        dataCollectionMethod: 'Daily observation checklist during recess and group activities',
        baseline: 'Currently initiates social interactions 1 out of 5 opportunities',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        userId: parentUser.id,
        studentId: studentId,
        title: 'Math Problem Solving',
        description: 'Emma will solve two-step word problems involving addition and subtraction with 75% accuracy over 4 consecutive weeks.',
        category: 'academic',
        status: 'Not Started',
        progress: 15,
        targetDate: '2025-06-10',
        dueDate: '2025-06-10',
        domain: 'Mathematics',
        measurableObjectives: ['Identify key information in word problems', 'Select appropriate operation', 'Show work using visual representations'],
        accommodations: ['Calculator for computation', 'Visual problem-solving steps', 'Manipulatives available'],
        dataCollectionMethod: 'Weekly assessments with documented work samples',
        baseline: 'Currently solves one-step problems with 60% accuracy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        userId: parentUser.id,
        studentId: studentId,
        title: 'Independent Work Completion',
        description: 'Emma will complete assigned independent work tasks within specified time limits with minimal adult prompting in 8 out of 10 trials.',
        category: 'behavioral',
        status: 'Completed',
        progress: 100,
        targetDate: '2025-02-28',
        dueDate: '2025-02-28',
        domain: 'Executive Functioning',
        measurableObjectives: ['Follow visual schedule independently', 'Ask for help when needed', 'Complete tasks before transition'],
        accommodations: ['Visual timer', 'Task checklist', 'Sensory break options'],
        dataCollectionMethod: 'Daily behavior tracking sheet',
        baseline: 'Currently completes independent work 4 out of 10 trials',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        userId: parentUser.id,
        studentId: studentId,
        title: 'Written Expression Skills',
        description: 'Emma will write a complete paragraph with topic sentence, 3 supporting details, and conclusion sentence with 80% structural accuracy.',
        category: 'academic',
        status: 'In Progress',
        progress: 30,
        targetDate: '2025-05-15',
        dueDate: '2025-05-15',
        domain: 'Writing',
        measurableObjectives: ['Write topic sentences', 'Include relevant supporting details', 'Use appropriate conclusion'],
        accommodations: ['Graphic organizers', 'Word prediction software', 'Extended time'],
        dataCollectionMethod: 'Weekly writing samples scored with rubric',
        baseline: 'Currently writes 2-3 sentences with limited organization',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert demo goals
    await db.insert(iepGoals).values(demoGoals);
    console.log('✅ Successfully created 5 demo IEP goals for Goal Tracker');

    // Create some demo progress notes
    const { progressNotes } = require("./shared/schema");
    
    const demoProgressNotes = [
      {
        id: randomUUID(),
        userId: parentUser.id,
        goalId: demoGoals[0].id, // Reading goal
        studentId: studentId,
        date: '2025-01-15',
        content: 'Emma showed great progress today! She successfully answered 4 out of 5 comprehension questions about the story we read. She was particularly strong with "who" and "what" questions.',
        status: 'active',
        serviceType: 'reading-intervention',
        notes: 'Continue with current strategy, consider adding more "why" questions next week',
        attachmentUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        userId: parentUser.id,
        goalId: demoGoals[1].id, // Social communication goal
        studentId: studentId,
        date: '2025-01-10',
        content: 'During recess, Emma used her social script to ask a classmate to play. This was the first time she initiated without prompting! She seemed proud of herself.',
        status: 'active',
        serviceType: 'social-skills',
        notes: 'Great breakthrough - will continue practicing different social scenarios',
        attachmentUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        userId: parentUser.id,
        goalId: demoGoals[3].id, // Independent work goal (completed)
        studentId: studentId,
        date: '2025-02-25',
        content: 'Emma has consistently completed her independent work for the past two weeks! She\'s using her visual timer effectively and asking for help when needed. Goal achieved!',
        status: 'active',
        serviceType: 'executive-function',
        notes: 'Goal successfully met - ready to move to next level of independence',
        attachmentUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.insert(progressNotes).values(demoProgressNotes);
    console.log('✅ Successfully created demo progress notes');

    await sql.end();
    console.log('🎉 Demo goal seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding demo goals:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDemoGoals();
}

module.exports = { seedDemoGoals };