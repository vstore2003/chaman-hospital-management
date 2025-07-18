"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Appointment {
  id: string
  date: string
  time: string
  status: string
  reason?: string
  notes?: string
  patient: {
    id: string
    name: string
    email: string
  }
  doctor: {
    id: string
    name: string
    specialization: string
  }
  createdAt: string
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    fetchAppointments()
  }, [session, status, router])

  useEffect(() => {
    let filtered = appointments
    if (statusFilter !== "ALL") {
      filtered = appointments.filter(apt => apt.status === statusFilter)
    }
    setFilteredAppointments(filtered)
  }, [appointments, statusFilter])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments")
      const data = await response.json()
      
      if (response.ok) {
        setAppointments(data.appointments || [])
      } else {
        console.error("Error fetching appointments:", data.error)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setAppointments(appointments.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ))
      } else {
        alert("Failed to update appointment status")
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
      alert("Failed to update appointment status")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { variant: "default" as const, label: "Scheduled" },
      COMPLETED: { variant: "secondary" as const, label: "Completed" },
      CANCELLED: { variant: "destructive" as const, label: "Cancelled" },
      NO_SHOW: { variant: "outline" as const, label: "No Show" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-2">
                {session.user?.role === "ADMIN" 
                  ? "Manage all hospital appointments" 
                  : "View and manage your appointments"
                }
              </p>
            </div>
            <Link href="/appointments/new">
              <Button>Schedule New Appointment</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Appointments ({filteredAppointments.length})</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {appointments.length === 0 
                    ? "No appointments found. Schedule your first appointment!" 
                    : "No appointments match the selected filter."
                  }
                </p>
                {appointments.length === 0 && (
                  <Link href="/appointments/new">
                    <Button className="mt-4">Schedule First Appointment</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                      {session.user?.role === "ADMIN" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {formatDate(appointment.date)}
                        </TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.patient.name}</TableCell>
                        <TableCell>{appointment.doctor.name}</TableCell>
                        <TableCell>{appointment.doctor.specialization}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>{appointment.reason || "N/A"}</TableCell>
                        {session.user?.role === "ADMIN" && (
                          <TableCell>
                            <div className="flex space-x-2">
                              {appointment.status === "SCHEDULED" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(appointment.id, "COMPLETED")}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(appointment.id, "CANCELLED")}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              <Link href={`/appointments/${appointment.id}`}>
                                <Button variant="outline" size="sm">View</Button>
                              </Link>
                            </div>
                          </TableCell>
                        )}
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
