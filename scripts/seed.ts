import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@chaman.com' },
    update: {},
    create: {
      name: 'Hospital Admin',
      email: 'admin@chaman.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@chaman.com' },
    update: {},
    create: {
      name: 'John Patient',
      email: 'user@chaman.com',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create sample doctors
  const doctors = await Promise.all([
    prisma.doctor.upsert({
      where: { email: 'dr.sharma@chaman.com' },
      update: {},
      create: {
        name: 'Dr. Rajesh Sharma',
        email: 'dr.sharma@chaman.com',
        phone: '+91-9876543210',
        specialization: 'Cardiology',
        qualification: 'MBBS, MD (Cardiology)',
        experience: 15,
        consultationFee: 800,
        availability: 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM',
      },
    }),
    prisma.doctor.upsert({
      where: { email: 'dr.patel@chaman.com' },
      update: {},
      create: {
        name: 'Dr. Priya Patel',
        email: 'dr.patel@chaman.com',
        phone: '+91-9876543211',
        specialization: 'Pediatrics',
        qualification: 'MBBS, MD (Pediatrics)',
        experience: 12,
        consultationFee: 600,
        availability: 'Mon-Sat: 10AM-6PM',
      },
    }),
    prisma.doctor.upsert({
      where: { email: 'dr.singh@chaman.com' },
      update: {},
      create: {
        name: 'Dr. Amarjeet Singh',
        email: 'dr.singh@chaman.com',
        phone: '+91-9876543212',
        specialization: 'Orthopedics',
        qualification: 'MBBS, MS (Orthopedics)',
        experience: 18,
        consultationFee: 1000,
        availability: 'Mon-Fri: 8AM-4PM',
      },
    }),
    prisma.doctor.upsert({
      where: { email: 'dr.kaur@chaman.com' },
      update: {},
      create: {
        name: 'Dr. Simran Kaur',
        email: 'dr.kaur@chaman.com',
        phone: '+91-9876543213',
        specialization: 'Gynecology',
        qualification: 'MBBS, MD (Gynecology)',
        experience: 10,
        consultationFee: 700,
        availability: 'Mon-Sat: 9AM-5PM',
      },
    }),
    prisma.doctor.upsert({
      where: { email: 'dr.kumar@chaman.com' },
      update: {},
      create: {
        name: 'Dr. Vikram Kumar',
        email: 'dr.kumar@chaman.com',
        phone: '+91-9876543214',
        specialization: 'General Medicine',
        qualification: 'MBBS, MD (Internal Medicine)',
        experience: 8,
        consultationFee: 500,
        availability: 'Mon-Sun: 24/7 Emergency',
      },
    }),
  ])

  // Create sample patients
  const patients = await Promise.all([
    prisma.patient.upsert({
      where: { email: 'patient1@example.com' },
      update: {},
      create: {
        name: 'Ravi Kumar',
        email: 'patient1@example.com',
        phone: '+91-9876543220',
        address: 'House No. 123, Sector 14, Bahadurgarh, Patiala, Punjab',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'Male',
        bloodGroup: 'B+',
        emergencyContact: 'Sunita Kumar - +91-9876543221',
        userId: user.id,
      },
    }),
    prisma.patient.upsert({
      where: { email: 'patient2@example.com' },
      update: {},
      create: {
        name: 'Meera Sharma',
        email: 'patient2@example.com',
        phone: '+91-9876543222',
        address: 'House No. 456, Model Town, Bahadurgarh, Patiala, Punjab',
        dateOfBirth: new Date('1990-03-22'),
        gender: 'Female',
        bloodGroup: 'A+',
        emergencyContact: 'Raj Sharma - +91-9876543223',
      },
    }),
    prisma.patient.upsert({
      where: { email: 'patient3@example.com' },
      update: {},
      create: {
        name: 'Harpreet Singh',
        email: 'patient3@example.com',
        phone: '+91-9876543224',
        address: 'House No. 789, Civil Lines, Bahadurgarh, Patiala, Punjab',
        dateOfBirth: new Date('1978-11-08'),
        gender: 'Male',
        bloodGroup: 'O+',
        emergencyContact: 'Jasbir Singh - +91-9876543225',
      },
    }),
  ])

  // Create sample appointments
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        date: new Date('2024-01-20'),
        time: '10:00 AM',
        status: 'SCHEDULED',
        reason: 'Regular checkup',
        notes: 'Patient complains of chest pain',
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        userId: user.id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: new Date('2024-01-21'),
        time: '2:00 PM',
        status: 'COMPLETED',
        reason: 'Child vaccination',
        notes: 'Routine vaccination completed',
        patientId: patients[1].id,
        doctorId: doctors[1].id,
      },
    }),
    prisma.appointment.create({
      data: {
        date: new Date('2024-01-22'),
        time: '11:30 AM',
        status: 'SCHEDULED',
        reason: 'Knee pain consultation',
        notes: 'Patient has been experiencing knee pain for 2 weeks',
        patientId: patients[2].id,
        doctorId: doctors[2].id,
      },
    }),
  ])

  // Create sample medical records
  const medicalRecords = await Promise.all([
    prisma.medicalRecord.create({
      data: {
        diagnosis: 'Hypertension',
        treatment: 'Prescribed ACE inhibitors and lifestyle changes',
        prescription: 'Lisinopril 10mg once daily, Low sodium diet',
        notes: 'Patient advised to monitor blood pressure daily',
        patientId: patients[0].id,
        userId: admin.id,
        recordDate: new Date('2024-01-15'),
      },
    }),
    prisma.medicalRecord.create({
      data: {
        diagnosis: 'Common Cold',
        treatment: 'Rest and symptomatic treatment',
        prescription: 'Paracetamol 500mg TID, Plenty of fluids',
        notes: 'Patient should recover in 5-7 days',
        patientId: patients[1].id,
        userId: admin.id,
        recordDate: new Date('2024-01-16'),
      },
    }),
  ])

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: 'Cardiology' },
      update: {},
      create: {
        name: 'Cardiology',
        description: 'Heart and cardiovascular system care',
        head: 'Dr. Rajesh Sharma',
      },
    }),
    prisma.department.upsert({
      where: { name: 'Pediatrics' },
      update: {},
      create: {
        name: 'Pediatrics',
        description: 'Child healthcare and development',
        head: 'Dr. Priya Patel',
      },
    }),
    prisma.department.upsert({
      where: { name: 'Orthopedics' },
      update: {},
      create: {
        name: 'Orthopedics',
        description: 'Bone, joint, and muscle care',
        head: 'Dr. Amarjeet Singh',
      },
    }),
    prisma.department.upsert({
      where: { name: 'Gynecology' },
      update: {},
      create: {
        name: 'Gynecology',
        description: 'Women\'s health and reproductive care',
        head: 'Dr. Simran Kaur',
      },
    }),
    prisma.department.upsert({
      where: { name: 'General Medicine' },
      update: {},
      create: {
        name: 'General Medicine',
        description: 'Primary healthcare and general medical conditions',
        head: 'Dr. Vikram Kumar',
      },
    }),
  ])

  // Create staff members
  const staff = await Promise.all([
    prisma.staff.upsert({
      where: { email: 'nurse1@chaman.com' },
      update: {},
      create: {
        name: 'Sister Manjeet Kaur',
        email: 'nurse1@chaman.com',
        phone: '+91-9876543230',
        position: 'Head Nurse',
        department: 'General Medicine',
        salary: 35000,
      },
    }),
    prisma.staff.upsert({
      where: { email: 'receptionist@chaman.com' },
      update: {},
      create: {
        name: 'Pooja Sharma',
        email: 'receptionist@chaman.com',
        phone: '+91-9876543231',
        position: 'Receptionist',
        department: 'Administration',
        salary: 25000,
      },
    }),
    prisma.staff.upsert({
      where: { email: 'pharmacist@chaman.com' },
      update: {},
      create: {
        name: 'Ramesh Gupta',
        email: 'pharmacist@chaman.com',
        phone: '+91-9876543232',
        position: 'Pharmacist',
        department: 'Pharmacy',
        salary: 40000,
      },
    }),
  ])

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Created:')
  console.log(`- ${2} users (1 admin, 1 regular user)`)
  console.log(`- ${doctors.length} doctors`)
  console.log(`- ${patients.length} patients`)
  console.log(`- ${appointments.length} appointments`)
  console.log(`- ${medicalRecords.length} medical records`)
  console.log(`- ${departments.length} departments`)
  console.log(`- ${staff.length} staff members`)
  
  console.log('\n🔑 Login Credentials:')
  console.log('Admin: admin@chaman.com / admin123')
  console.log('User: user@chaman.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
