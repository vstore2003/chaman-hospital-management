import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const whereClause: any = {}
    if (status) {
      whereClause.status = status
    }

    // If user is not admin, only show their appointments
    if (session.user?.role !== "ADMIN") {
      whereClause.userId = session.user?.id
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: true,
        doctor: true,
        user: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      date,
      time,
      patientId,
      doctorId,
      reason,
      notes
    } = body

    if (!date || !time || !patientId || !doctorId) {
      return NextResponse.json(
        { error: "Date, time, patient, and doctor are required" },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time,
        patientId,
        doctorId,
        userId: session.user?.id,
        reason,
        notes,
        status: "SCHEDULED"
      },
      include: {
        patient: true,
        doctor: true
      }
    })

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    )
  }
}
