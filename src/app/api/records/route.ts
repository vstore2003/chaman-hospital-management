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
    const patientId = searchParams.get('patientId')
    
    const whereClause: any = {}
    if (patientId) {
      whereClause.patientId = patientId
    }

    // If user is not admin, only show their records
    if (session.user?.role !== "ADMIN") {
      whereClause.userId = session.user?.id
    }

    const records = await prisma.medicalRecord.findMany({
      where: whereClause,
      include: {
        patient: true,
        user: true
      },
      orderBy: {
        recordDate: 'desc'
      }
    })

    return NextResponse.json({ records })
  } catch (error) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json(
      { error: "Failed to fetch medical records" },
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
      diagnosis,
      treatment,
      prescription,
      notes,
      patientId,
      recordDate
    } = body

    if (!diagnosis || !treatment || !patientId) {
      return NextResponse.json(
        { error: "Diagnosis, treatment, and patient are required" },
        { status: 400 }
      )
    }

    const record = await prisma.medicalRecord.create({
      data: {
        diagnosis,
        treatment,
        prescription,
        notes,
        patientId,
        userId: session.user?.id,
        recordDate: recordDate ? new Date(recordDate) : new Date()
      },
      include: {
        patient: true
      }
    })

    return NextResponse.json({ record }, { status: 201 })
  } catch (error) {
    console.error("Error creating medical record:", error)
    return NextResponse.json(
      { error: "Failed to create medical record" },
      { status: 500 }
    )
  }
}
