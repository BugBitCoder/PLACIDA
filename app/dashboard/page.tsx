import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardHome() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Welcome back</h1>
      <p className="text-muted-foreground">Jump back into your well-being journey. Choose a section below.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <h3 className="font-semibold">Start a reflection</h3>
            <p className="text-sm text-muted-foreground mt-1">Talk to the AI companion for gentle guidance.</p>
            <Button asChild className="mt-3">
              <Link href="/dashboard/chatbot">Open Chatbot</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <h3 className="font-semibold">Log today’s mood</h3>
            <p className="text-sm text-muted-foreground mt-1">Track emotions and watch trends over time.</p>
            <Button asChild className="mt-3" variant="secondary">
              <Link href="/dashboard/mood-tracker">Open Mood Tracker</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
