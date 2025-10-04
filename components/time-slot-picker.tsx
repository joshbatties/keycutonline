"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

interface TimeSlotPickerProps {
  selectedDate: Date | null
  selectedTime: string | null
  onDateChange: (date: Date | null) => void
  onTimeChange: (time: string | null) => void
}

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

export function TimeSlotPicker({ selectedDate, selectedTime, onDateChange, onTimeChange }: TimeSlotPickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)

  return (
    <div className="space-y-6">
      <div>
        <Label>Select Date *</Label>
        <div className="mt-2 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={onDateChange}
            disabled={(date) => date < today || date > maxDate}
            className="rounded-md border"
          />
        </div>
      </div>

      {selectedDate && (
        <div>
          <Label>Select Time *</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => onTimeChange(time)}
                className="w-full"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
