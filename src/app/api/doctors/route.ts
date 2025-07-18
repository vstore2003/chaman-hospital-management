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

    const doctors = await prisma.doctor.findMany({
      include: {
        appointments: {
          include: {
            patient: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ doctors })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
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
      specialization,
      qualification,
      experience,
      consultationFee,
      availability
    } = body

    if (!name || !email || !specialization) {
      return NextResponse.json(
        { error: "Name, email, and specialization are required" },
        { status: 400 }
      )
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        email,
        phone,
        specialization,
        qualification,
        experience: experience ? parseInt(experience) : null,
        consultationFee: consultationFee ? parseFloat(consultationFee) : null,
        availability
      }
    })

    return NextResponse.json({ doctor }, { status: 201 })
  } catch (error) {
    console.error("Error creating doctor:", error)
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    )
  }
}
