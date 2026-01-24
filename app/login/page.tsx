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

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                },
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google")
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
                        <div className="grid gap-4">
                            <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Sign in with Google
                            </Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4 mt-4">
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
                            <Link href="/signup" className="text-primary hover:underline">
                                Sign up
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
