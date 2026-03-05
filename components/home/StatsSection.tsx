'use client'

import { motion, useInView, animate } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

interface StatProps {
    end: number
    suffix?: string
    prefix?: string
    label: string
}

function Counter({ end, suffix = '', prefix = '', label }: StatProps) {
    const ref = useRef(null)
    const [count, setCount] = useState(0)
    const isInView = useInView(ref, { once: true, margin: '-50px' })

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, end, {
                duration: 2,
                ease: 'easeOut',
                onUpdate: (value) => {
                    setCount(Math.round(value))
                }
            })
            return controls.stop
        }
    }, [end, isInView])

    return (
        <div className="flex flex-col items-center text-center p-6 border-r border-brand-border/10 last:border-r-0 md:border-b-0 border-b md:last:border-b-0">
            <span ref={ref} className="text-3xl md:text-4xl lg:text-5xl font-accent text-brand-gold mb-2 font-light tabular-nums">
                {prefix}{count}{suffix}
            </span>
            <span className="text-sm font-semibold tracking-widest uppercase text-brand-text-muted">
                {label}
            </span>
        </div>
    )
}

export function StatsSection() {
    return (
        <section className="bg-brand-bg-dark text-white py-16 lg:py-24 border-y border-brand-border/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-0 gap-y-12">
                        <Counter end={150} suffix="+" label="Families Helped" />
                        <Counter end={5} suffix="+" label="Years Licensed" />
                        <Counter end={25} suffix="+" label="Years in Region" />
                        <Counter end={50} prefix="$" suffix="M+" label="Sold Properties" />
                        <Counter end={6} label="Languages Spoken" />
                    </div>

                    <div className="text-center mt-12 pt-12 border-t border-brand-border/10">
                        <p className="italic text-brand-text-muted text-sm md:text-base leading-relaxed">
                            "Every number represents a family who trusted me with one of the biggest decisions of their life."
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    )
}
