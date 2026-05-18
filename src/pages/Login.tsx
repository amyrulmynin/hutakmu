import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { api } from "../lib/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api.login({ email, password })
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      if (data.user.role === "borrower") {
        navigate("/my-debts")
      } else {
        navigate("/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Log Masuk</CardTitle>
          <p className="text-sm text-muted-foreground">Masukkan email dan password</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>{loading ? "Loading..." : "Log Masuk"}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Belum ada akaun? <Link to="/register" className="text-primary underline">Daftar</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
