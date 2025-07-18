"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Patient {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  bloodGroup?: string
  emergencyContact?: string
  createdAt: string
  appointments: any[]
  medicalRecords: any[]
}

export default function PatientsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    if (session.user?.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }

    fetchPatients()
  }, [session, status, router])

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone && patient.phone.includes(searchTerm))
    )
    setFilteredPatients(filtered)
  }, [patients, searchTerm])

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients")
      const data = await response.json()
      
      if (response.ok) {
        setPatients(data.patients || [])
      } else {
        console.error("Error fetching patients:", data.error)
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setPatients(patients.filter(p => p.id !== patientId))
      } else {
        alert("Failed to delete patient")
      }
    } catch (error) {
      console.error("Error deleting patient:", error)
      alert("Failed to delete patient")
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-2">
                Manage patient records and information
              </p>
            </div>
            <Link href="/patients/new">
              <Button>Add New Patient</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Patients ({filteredPatients.length})</CardTitle>
            <div className="flex gap-4">
              <Input
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {patients.length === 0 ? "No patients found. Add your first patient!" : "No patients match your search."}
                </p>
                {patients.length === 0 && (
                  <Link href="/patients/new">
                    <Button className="mt-4">Add First Patient</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Appointments</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>{patient.phone || "N/A"}</TableCell>
                        <TableCell>{patient.bloodGroup || "N/A"}</TableCell>
                        <TableCell>{patient.appointments?.length || 0}</TableCell>
                        <TableCell>{patient.medicalRecords?.length || 0}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/patients/${patient.id}`}>
                              <Button variant="outline" size="sm">View</Button>
                            </Link>
                            <Link href={`/patients/${patient.id}/edit`}>
                              <Button variant="outline" size="sm">Edit</Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePatient(patient.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
