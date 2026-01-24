"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, CheckCircle2, LogOut } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OnboardingPage() {
    const router = useRouter()
    const [productCode, setProductCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [verifyingSession, setVerifyingSession] = useState(true)

    // Verify authentication on mount
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push("/login")
            } else {
                setVerifyingSession(false)
            }
        }
        checkSession()
    }, [router])

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase
                .rpc('claim_product_code', { input_code: productCode })

            if (error) throw error

            if (data && data.success) {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/dashboard")
                }, 2000)
            } else {
                setError(data?.message || "Invalid Product Code")
            }
        } catch (err: any) {
            setError(err.message || "Failed to verified code")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/login")
    }

    if (verifyingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-900">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
                <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-center p-8">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">Setup Complete!</CardTitle>
                    <CardDescription className="text-zinc-400 text-lg">
                        Your device has been linked successfully.
                    </CardDescription>
                    <div className="mt-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-500 mr-2 inline" />
                        <span className="text-zinc-500">Entering Dashboard...</span>
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
                    <div className="flex items-center gap-2 mb-12">
                        <Image
                            src="/images/fostride-logo-new.svg"
                            alt="Fostride"
                            width={140}
                            height={36}
                            className="h-8 w-auto brightness-0 invert"
                        />
                    </div>
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        Almost there...
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        We just need to link your account to a Smart Bin.
                    </p>
                </div>
            </div>

            {/* Right: Code Form */}
            <div className="flex items-center justify-center p-8 bg-zinc-950">
                <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-white">Device Setup</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Enter the Product Code found on your device
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleClaim} className="space-y-4">
                            {error && (
                                <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-200">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="productCode" className="text-white">Product Code</Label>
                                <Input
                                    id="productCode"
                                    type="text"
                                    placeholder="e.g. BIN-XXXX-XXXX"
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                    required
                                    className="bg-zinc-800 border-zinc-700 text-white focus:ring-primary focus:border-primary"
                                />
                            </div>

                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Link Device & Continue"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                            <button
                                onClick={handleLogout}
                                className="text-sm text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-2 mx-auto transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out and try a different account
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
