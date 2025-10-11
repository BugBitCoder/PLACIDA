"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Therapist = {
  id: string
  name: string
  specialty: "Anxiety" | "Depression" | "Relationships" | "Trauma"
  location: string
  rating: number
}

const MOCK: Therapist[] = [
  { id: "t1", name: "Dr. Amara K.", specialty: "Anxiety", location: "Remote", rating: 4.9 },
  { id: "t2", name: "Jordan S.", specialty: "Depression", location: "New York, NY", rating: 4.7 },
  { id: "t3", name: "Priya R.", specialty: "Relationships", location: "Remote", rating: 4.8 },
  { id: "t4", name: "Luis M.", specialty: "Trauma", location: "Austin, TX", rating: 4.6 },
]

export function TherapistList() {
  const [q, setQ] = useState("")
  const [spec, setSpec] = useState<string>("All")

  const filtered = useMemo(() => {
    return MOCK.filter((t) => {
      const matchesQ =
        q.trim().length === 0 ||
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.location.toLowerCase().includes(q.toLowerCase())
      const matchesS = spec === "All" || t.specialty === spec
      return matchesQ && matchesS
    })
  }, [q, spec])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or location"
          className="md:max-w-sm"
        />
        <Select value={spec} onValueChange={setSpec}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Anxiety">Anxiety</SelectItem>
            <SelectItem value="Depression">Depression</SelectItem>
            <SelectItem value="Relationships">Relationships</SelectItem>
            <SelectItem value="Trauma">Trauma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((t) => (
          <Card key={t.id} className="rounded-2xl">
            <CardContent className="p-5 space-y-2">
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground">
                {t.specialty} • {t.location}
              </p>
              <p className="text-sm">Rating: {t.rating.toFixed(1)} / 5</p>
              <BookingDialog therapist={t} />
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No therapists match your filters.</p>}
      </div>
    </div>
  )
}

function BookingDialog({ therapist }: { therapist: Therapist }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full">Book a session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book with {therapist.name}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Request sent! The therapist will contact you via email.")
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Preferred date</Label>
            <Input id="date" type="date" required />
          </div>
          <Button type="submit" className="rounded-full w-full">
            Request booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
