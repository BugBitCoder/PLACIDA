"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Smile, Users, Stethoscope, Home, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/chatbot", label: "Chatbot", icon: Brain },
  { href: "/dashboard/mood-tracker", label: "Mood Tracker", icon: Smile },
  { href: "/dashboard/community", label: "Community", icon: Users },
  { href: "/dashboard/therapists", label: "Therapists", icon: Stethoscope },
  { href: "/dashboard/mindful-games", label: "Mindful Games", icon: Sparkles },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="h-full border-r bg-sidebar">
      <div className="p-4 text-xl font-semibold">
        <Link href="/" className="text-primary">
          Placida
        </Link>
      </div>
      <nav className="px-2 pb-4">
        <ul className="space-y-1">
          {items.map((it) => {
            const active = pathname === it.href
            const Icon = it.icon
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="text-sm">{it.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
