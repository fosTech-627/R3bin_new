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
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [productCode, setProductCode] = useState("")

    // States
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Sign Up User into Supabase Auth
            // Note: If email confirmation is enabled, they can't login immediately.
            // For now assuming auto-confirm or developer mode is handy.
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            })

            if (authError) throw authError

            if (authData.user) {
                // 2. Claim Product Code
                // We must be logged in to call this RPC if it uses auth.uid()
                // Depending on Supabase settings, sign-up might auto-login.
                // If not, we might need to signIn first, but usually signUp returns a session if email confirm is off.

                if (authData.session) {
                    const { data: claimData, error: claimError } = await supabase
                        .rpc('claim_product_code', { input_code: productCode })

                    if (claimError) {
                        // User created, but code failed. Weak state.
                        setError("Account created, but Product Code was invalid. Please contact support.")
                        // Optionally redirect to dashboard anyway? But they see nothing.
                        return
                    }

                    if (claimData && claimData.success) {
                        setSuccess(true)
                        setTimeout(() => {
                            router.push("/dashboard")
                        }, 2000)
                    } else {
                        setError(claimData?.message || "Invalid Product Code")
                    }
                } else {
                    // Email confirmation case
                    setSuccess(true)
                    // We can't claim code yet if they aren't logged in.
                    // This is a tradeoff. 
                    // Ideally, we'd claim code via a customized Admin function or deferred claim.
                    // But for this demo, let's assume auto-login.
                    setError("Please check your email to confirm your account.")
                }
            }

        } catch (err: any) {
            setError(err.message || "Failed to create account")
        } finally {
            setLoading(false)
        }
    }

    if (success && !error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md border-border bg-card text-center p-8">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">Account Created!</CardTitle>
                    <CardDescription className="text-lg">
                        Your product code has been verified and your dashboard is ready.
                    </CardDescription>
                    <div className="mt-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground mr-2 inline" />
                        <span className="text-muted-foreground">Redirecting to Dashboard...</span>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <Image
                            src="/images/fostride-logo-new.svg"
                            alt="Fostride"
                            width={140}
                            height={36}
                            className="h-8 w-auto brightness-0 invert"
                        />
                    </Link>
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        Join the Waste Intelligence Network
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Activate your bin and start monitoring your environmental impact today.
                    </p>
                </div>
                <div className="text-sm text-zinc-500">
                    &copy; {new Date().getFullYear()} Fostride. All rights reserved.
                </div>
            </div>

            {/* Right: Sign Up Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <Card className="w-full max-w-md border-border bg-card">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-foreground">Create an account</CardTitle>
                        <CardDescription>
                            Enter your details and Product Code to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="bg-background border-input"
                                />
                            </div>

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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-background border-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="productCode" className="text-primary font-bold">Product Code</Label>
                                <Input
                                    id="productCode"
                                    type="text"
                                    placeholder="e.g. BIN-XXXX-XXXX"
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                    required
                                    className="bg-background border-primary/20 focus:border-primary"
                                />
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Found on the back of your Smart Bin
                                </p>
                            </div>

                            <Button type="submit" className="w-full mt-6" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying Code...
                                    </>
                                ) : (
                                    "Activate & Sign Up"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                        <div>
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
