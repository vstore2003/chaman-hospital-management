"use client"

import { useSession } from "next-auth/react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Chaman Hospital Management System
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Bahadurgarh, Patiala, India
          </p>
          <p className="text-lg text-gray-500">
            Complete healthcare management solution for patients and staff
          </p>
        </div>

        {!session ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>For Patients</CardTitle>
                  <CardDescription>
                    Book appointments, view medical records, and manage your healthcare
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      • Schedule appointments with doctors
                    </p>
                    <p className="text-sm text-gray-600">
                      • View your medical history
                    </p>
                    <p className="text-sm text-gray-600">
                      • Access prescription details
                    </p>
                    <Link href="/register">
                      <Button className="w-full">Register as Patient</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>For Hospital Staff</CardTitle>
                  <CardDescription>
                    Manage patients, appointments, and medical records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      • Manage patient records
                    </p>
                    <p className="text-sm text-gray-600">
                      • Schedule and track appointments
                    </p>
                    <p className="text-sm text-gray-600">
                      • Access comprehensive dashboard
                    </p>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">Staff Login</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Hospital Services
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-semibold text-lg mb-2">Emergency Care</h3>
                  <p className="text-gray-600">24/7 emergency medical services</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-semibold text-lg mb-2">Specialized Treatment</h3>
                  <p className="text-gray-600">Expert doctors in various specializations</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-semibold text-lg mb-2">Digital Records</h3>
                  <p className="text-gray-600">Secure digital medical record management</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Welcome back, {session.user?.name}!
            </h2>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/patients">
                  <Button variant="outline" size="lg">Manage Patients</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
