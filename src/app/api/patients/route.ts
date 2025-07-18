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

    const patients = await prisma.patient.findMany({
      include: {
        appointments: {
          include: {
            doctor: true
          }
        },
        medicalRecords: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ patients })
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      address,
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContact
    } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        bloodGroup,
        emergencyContact
      }
    })

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    )
  }
}
