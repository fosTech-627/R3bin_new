"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            if (data.session) {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign in")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <Image
                            src="/images/fostride-logo-new.svg" // Assuming this exists from previous steps
                            alt="Fostride"
                            width={140}
                            height={36}
                            className="h-8 w-auto brightness-0 invert"
                        />
                    </Link>
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        Smart Waste Intelligence for Modern Campuses
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Monitor fill levels, track composition, and optimize collections in real-time.
                    </p>
                </div>
                <div className="text-sm text-zinc-500">
                    &copy; {new Date().getFullYear()} Fostride. All rights reserved.
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <Card className="w-full max-w-md border-border bg-card">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-foreground">Sign in</CardTitle>
                        <CardDescription>
                            Enter your email and password to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-background border-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="#"
                                        className="text-sm text-primary hover:underline"
                                        onClick={(e) => e.preventDefault()} // Placeholder implementation
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-background border-input"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                        <div>
                            Don&apos;t have an account?{" "}
                            <Link href="/contact" className="text-primary hover:underline">
                                Contact Sales
                            </Link>
                        </div>
                        <Link href="/" className="text-muted-foreground hover:text-foreground">
                            ← Back to Home
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
