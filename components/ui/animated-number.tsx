"use client"

import { useEffect, useState } from "react"

export function AnimatedNumber({ value, suffix = "", prefix = "", decimalPlaces = 2 }: { value: number, suffix?: string, prefix?: string, decimalPlaces?: number }) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        let startTimestamp: number | null = null
        const duration = 2000 // 2 seconds animation
        const startValue = displayValue
        const endValue = value

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)

            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

            const current = startValue + (endValue - startValue) * easeProgress
            setDisplayValue(current)

            if (progress < 1) {
                window.requestAnimationFrame(step)
            }
        }

        window.requestAnimationFrame(step)
    }, [value])

    return (
        <span>
            {prefix}
            {displayValue.toFixed(decimalPlaces)}
            {suffix}
        </span>
    )
}
