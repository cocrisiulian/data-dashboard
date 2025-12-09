"use client"

import { useAuth } from "@/contexts/AuthContext"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/controls/button"
import { Input } from "@/components/ui/controls/input"
import { Label } from "@/components/ui/text/label"
import { Badge } from "@/components/ui/text/badge"
import { Separator } from "@/components/ui/text/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { User, Mail, CreditCard, BarChart3, FileText, LayoutDashboard, Settings, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api/client"
import { showError, showSuccess } from "@/lib/utils/error-handler"
import { useRouter } from "next/navigation"
import Link from "next/link"

type UserStats = {
  dashboards: number
  files: number
  charts: number
}

export default function ProfilePage() {
  const { user, isLoading, refreshUser, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats>({ dashboards: 0, files: 0, charts: 0 })
  const [loadingStats, setLoadingStats] = useState(true)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setEmail(user.email)
      loadUserStats()
    }
  }, [user])

  const loadUserStats = async () => {
    try {
      setLoadingStats(true)
      const [dashboardsRes, filesRes] = await Promise.all([
        api.dashboards.getAll(),
        api.files.getAll()
      ])

      // Count total charts across all dashboards
      let totalCharts = 0
      if (dashboardsRes && Array.isArray(dashboardsRes)) {
        dashboardsRes.forEach((dashboard: any) => {
          if (dashboard.charts && Array.isArray(dashboard.charts)) {
            totalCharts += dashboard.charts.length
          }
        })
      }

      setStats({
        dashboards: dashboardsRes?.length || 0,
        files: filesRes?.length || 0,
        charts: totalCharts
      })
    } catch (error) {
      showError(error, "Nu s-au putut încărca statisticile")
    } finally {
      setLoadingStats(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName.trim()) {
      showError({ message: "Numele este obligatoriu" })
      return
    }

    try {
      setUpdatingProfile(true)
      await api.auth.updateProfile({ fullName, email })
      await refreshUser()
      showSuccess("Profil actualizat cu succes")
    } catch (error) {
      showError(error, "Nu s-a putut actualiza profilul")
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      showError({ message: "Toate câmpurile sunt obligatorii" })
      return
    }

    if (newPassword !== confirmPassword) {
      showError({ message: "Parolele noi nu se potrivesc" })
      return
    }

    if (newPassword.length < 6) {
      showError({ message: "Parola trebuie să aibă cel puțin 6 caractere" })
      return
    }

    try {
      setChangingPassword(true)
      await api.auth.changePassword(currentPassword, newPassword)
      showSuccess("Parola a fost schimbată cu succes")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      showError(error, "Nu s-a putut schimba parola")
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      showError(error, "Nu s-a putut efectua deconectarea")
    }
  }

  if (isLoading) {
    return null
  }

  if (!user) {
    return null
  }

  const currentPlan = user.plan || {
    name: "Free",
    maxFiles: 5,
    maxCharts: 10,
    maxDashboards: 3
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Profilul Meu</h1>
              <p className="text-slate-300">Gestionează-ți contul și setările</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Deconectare
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Dashboard-uri</CardTitle>
                <LayoutDashboard className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loadingStats ? "..." : `${stats.dashboards} / ${currentPlan.maxDashboards}`}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {currentPlan.maxDashboards - stats.dashboards} disponibile
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Fișiere CSV</CardTitle>
                <FileText className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loadingStats ? "..." : `${stats.files} / ${currentPlan.maxFiles}`}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {currentPlan.maxFiles - stats.files} disponibile
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Grafice</CardTitle>
                <BarChart3 className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loadingStats ? "..." : `${stats.charts} / ${currentPlan.maxCharts}`}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {currentPlan.maxCharts - stats.charts} disponibile
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700">
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="plan" className="data-[state=active]:bg-slate-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Abonament
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
                <Shield className="h-4 w-4 mr-2" />
                Securitate
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Informații Personale</CardTitle>
                  <CardDescription className="text-slate-300">
                    Actualizează-ți informațiile de profil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-300">Nume Complet</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Numele tău complet"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={updatingProfile}
                      className="w-full"
                    >
                      {updatingProfile ? "Se actualizează..." : "Salvează Modificările"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Plan Tab */}
            <TabsContent value="plan" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    Planul Curent
                    <Badge variant={currentPlan.name === "Pro" ? "default" : "secondary"}>
                      {currentPlan.name}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Detalii despre abonamentul tău
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Dashboard-uri</p>
                          <p className="text-xs text-slate-400">Maximum permis</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-white">{currentPlan.maxDashboards}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Fișiere CSV</p>
                          <p className="text-xs text-slate-400">Maximum permis</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-white">{currentPlan.maxFiles}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Grafice</p>
                          <p className="text-xs text-slate-400">Maximum permis</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-white">{currentPlan.maxCharts}</p>
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-slate-300">
                      {currentPlan.name === "Pro" 
                        ? "Ai acces complet la toate funcționalitățile platformei."
                        : "Faci upgrade pentru a debloca mai multe funcționalități."}
                    </p>
                    <Button asChild variant={currentPlan.name === "Pro" ? "outline" : "default"}>
                      <Link href="/pricing">
                        {currentPlan.name === "Pro" ? "Vizualizează Planuri" : "Upgrade la Pro"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Utilizare Curentă</CardTitle>
                  <CardDescription className="text-slate-300">
                    Statistici despre resursele tale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Dashboard-uri</span>
                      <span className="text-white font-medium">
                        {stats.dashboards} / {currentPlan.maxDashboards}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${(stats.dashboards / currentPlan.maxDashboards) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Fișiere CSV</span>
                      <span className="text-white font-medium">
                        {stats.files} / {currentPlan.maxFiles}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(stats.files / currentPlan.maxFiles) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Grafice</span>
                      <span className="text-white font-medium">
                        {stats.charts} / {currentPlan.maxCharts}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(stats.charts / currentPlan.maxCharts) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Schimbă Parola</CardTitle>
                  <CardDescription className="text-slate-300">
                    Actualizează-ți parola pentru a-ți menține contul securizat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-slate-300">
                        Parola Curentă
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Introdu parola curentă"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-slate-300">
                        Parolă Nouă
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Introdu parola nouă"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-300">
                        Confirmă Parola Nouă
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmă parola nouă"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={changingPassword}
                      className="w-full"
                    >
                      {changingPassword ? "Se schimbă parola..." : "Schimbă Parola"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Informații Cont</CardTitle>
                  <CardDescription className="text-slate-300">
                    Detalii despre contul tău
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Email</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-white">ID Utilizator</p>
                        <p className="text-xs text-slate-400 font-mono">{user.id}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
