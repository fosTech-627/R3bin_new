"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    router.push("/login")
                } else {
                    // Cleanup hash if present (common artifact from OAuth)
                    if (window.location.hash) {
                        window.history.replaceState(null, '', window.location.pathname)
                    }

                    // Check if user has access to any bins
                    // We assume if they have 0 associated bins, they are new/unlinked.
                    const { count, error } = await supabase
                        .from('bin_access')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', session.user.id)

                    if (!error) {
                        if (count === 0) {
                            console.log('User has no bins, redirecting to onboarding')
                            router.push("/onboarding")
                        }
                    }
                }
            } catch (error) {
                console.error("Auth check failed", error)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return <>{children}</>
}
