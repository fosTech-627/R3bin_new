'use client'

import React from 'react'
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Linkedin, Mail, Instagram, ArrowUpRight } from 'lucide-react'

export default function TeamPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
                <div className="mx-auto max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                            Hey There! Welcome to <br />
                            <span className="text-primary bg-primary/10 px-4 rounded-xl inline-block mt-2">Fostride!</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Revolutionizing waste management through innovative technology and sustainable practices.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-forwards">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">About our Company</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Let's get acquainted! At Fostride, we're passionate about sustainability and innovation. Our mission
                                is to redefine waste, transforming it into opportunities for a greener tomorrow. From AI-powered
                                solutions to grassroots initiatives, we're creating a cleaner planet—because sustainability isn't
                                just a goal, it's an exciting journey.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Join us as we revolutionize waste management and build a better future, one solution at a time.
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-xl font-semibold">01. Our History</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    Fostride began in 2022 as a simple yet ambitious idea for a school competition. What started
                                    as a small concept has now evolved into a determined effort to develop groundbreaking
                                    technology that focuses on waste sorting and conversion for a sustainable future.
                                    <br /><br />
                                    In 2024, we made significant strides, directing our focus entirely on expanding our R&D
                                    capabilities to create more effective and eco-friendly solutions.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-xl font-semibold">02. Our Mission</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    To revolutionize waste management through innovative technology, fostering a circular economy
                                    that minimizes environmental impact and creates sustainable value. By connecting waste
                                    generators, recyclers, and upcyclers, we aim to empower communities to promote a cleaner, greener future.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-xl font-semibold">03. Our Vision</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    To lead the global transition toward a zero-waste future by transforming waste into
                                    opportunities, fostering sustainable practices, and creating a world where every resource is
                                    valued, reused, and repurposed.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                {/* Background blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
            </section>

            {/* Founder Section */}
            <section className="py-20 px-4 md:px-8 bg-muted/30">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12">
                        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5">LEADERSHIP</Badge>
                        <h2 className="text-4xl font-bold mb-6">Meet The Founder</h2>
                        <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl leading-normal">
                            Gavi Kothari, the <span className="text-foreground font-medium">founder of Fostride</span>, is passionate about <span className="text-foreground font-medium">leveraging technology</span> for <span className="text-foreground font-medium">sustainability</span>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                        {/* Image Column */}
                        <div className="lg:col-span-5 relative group opacity-0 animate-in fade-in slide-in-from-left-8 duration-700 delay-300 fill-mode-forwards">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
                                <Image
                                    src="/images/team/founder.png"
                                    alt="Gavi Kothari"
                                    fill
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-24">
                                    <h3 className="text-3xl font-bold text-white">Gavi <span className="text-primary font-normal">KOTHARI</span></h3>
                                    <p className="text-white/80">Founder & CEO</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-7 space-y-8 opacity-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-forwards">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Gavi Kothari is an accomplished professional who brings passion, innovation, and leadership to his endeavors.
                                With a strong presence in the industry, Gavi has been instrumental in driving impactful initiatives.
                                His expertise spans across various fields, combining technological innovation with sustainable practices to create value.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {['Visionary Thinker', 'Empathetic Leader', 'Creative Problem-Solver', 'Passionate Mentor'].map((skill) => (
                                    <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm">
                                        ⌘ {skill}
                                    </Badge>
                                ))}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <p className="text-sm font-medium text-muted-foreground">Connect:</p>
                                <div className="flex flex-wrap gap-4">
                                    <Button asChild variant="outline" className="rounded-full group hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors">
                                        <a href="https://in.linkedin.com/in/gavikothari" target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="w-4 h-4 mr-2" /> LINKEDIN <ArrowUpRight className="w-3 h-3 ml-1 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline" className="rounded-full group hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors">
                                        <a href="https://www.instagram.com/gavi.kothari/" target="_blank" rel="noopener noreferrer">
                                            <Instagram className="w-4 h-4 mr-2" /> INSTAGRAM <ArrowUpRight className="w-3 h-3 ml-1 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </Button>
                                    <Button asChild variant="outline" className="rounded-full group hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors">
                                        <a href="mailto:gavi@fostride.com">
                                            <Mail className="w-4 h-4 mr-2" /> MAIL <ArrowUpRight className="w-3 h-3 ml-1 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-20 px-4 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">TEAM MEMBERS</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Say Hello to Our Squad</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Get ready to meet the faces behind the magic, the dreamers, the doers, and the unstoppable force driving our success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, idx) => (
                            <div
                                key={member.name}
                                className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="aspect-[4/4] relative overflow-hidden bg-muted">
                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-6xl font-black text-white/10 select-none mix-blend-overlay">{member.watermark2}</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                <div className="absolute bottom-0 inset-x-0 p-6 z-20">
                                    <p className="text-primary font-medium tracking-wide text-xs mb-1 uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        {member.role_detail}
                                    </p>
                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                                    <p className="text-white/70">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 md:px-8 border-t border-border/40 bg-card/30">
                <div className="mx-auto max-w-7xl text-center">
                    <h2 className="text-[12vw] md:text-[15vw] leading-none font-black text-muted/20 select-none tracking-tighter">
                        VALUES
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4 -mt-12 md:-mt-24 relative z-10">
                        {['Sustainability', 'Impact', 'Trustworthiness', 'Circularity', 'Innovation', 'Collaboration', 'Integrity', 'Quality'].map((val, i) => (
                            <div key={val} className={`px-6 py-3 rounded-full border backdrop-blur-sm ${i % 2 === 0 ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-background/80 border-border text-foreground'} font-medium text-lg`}>
                                ⌘ {val}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

const teamMembers = [
    {
        name: 'Piyush Tanwar',
        role: 'Chief Marketing Officer',
        role_detail: 'Marketing Genius',
        image: '/images/team/piyush.png',
        watermark: 'Strategic',
        watermark2: 'CMO'
    },
    {
        name: 'Aryan Nair',
        role: 'Chief Strategy Officer',
        role_detail: 'Ingenious Strategy',
        image: '/images/team/aryan.png',
        watermark: 'Practical',
        watermark2: 'CSO'

    },
    {
        name: 'Gobind Singh',
        role: 'R&D Head',
        role_detail: 'Design & Developer',
        image: '/images/team/gobind.png',
        watermark: 'Visionary',
        watermark2: 'R&D'
    },
    {
        name: 'Aryan Jain',
        role: 'Chief Financial Officer',
        role_detail: 'Financial Forecasting',
        image: '/images/team/aryan_jain.png',
        watermark: 'Finance',
        watermark2: 'CFO'
    },
    {
        name: 'Mayank Verma',
        role: 'Chief Technology Officer',
        role_detail: 'Specialized Computing',
        image: '/images/team/mayank_verma.png',
        watermark: 'Tech',
        watermark2: 'CTO'
    }
]
