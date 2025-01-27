import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* Time Utils */
export type TimeFormat = "12h" | "24h"
export type Period = "AM" | "PM"

export interface Time {
  hours: number
  minutes: number
  seconds: number
  period?: Period
}

export function convertTo24Hour(time: Time): number {
  let hours = time.hours

  if (time.period === "PM" && hours !== 12) {
    hours += 12
  } else if (time.period === "AM" && hours === 12) {
    hours = 0
  }

  return hours
}

export function convertTo12Hour(hours: number): { hours: number; period: Period } {
  const period: Period = hours >= 12 ? "PM" : "AM"
  let adjustedHours = hours % 12
  adjustedHours = adjustedHours === 0 ? 12 : adjustedHours

  return { hours: adjustedHours, period }
}

export function formatTime(time: Time, format: TimeFormat = "12h"): string {
  let hours = time.hours ?? 0
  const minutes = time.minutes ?? 0
  const seconds = time.seconds ?? 0

  if (format === "12h") {
    hours = hours % 12
    hours = hours === 0 ? 12 : hours
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${time.period ?? "AM"}`
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function parseTimeInput(value: string, type: "hours" | "minutes" | "seconds"): number {
  const num = Number.parseInt(value, 10)
  if (isNaN(num)) return 0

  switch (type) {
    case "hours":
      return Math.min(Math.max(num, 0), 23)
    case "minutes":
    case "seconds":
      return Math.min(Math.max(num, 0), 59)
  }
}

export function incrementTimeValue(time: Time, type: "hours" | "minutes" | "seconds"): Time {
  const newTime = { ...time }

  switch (type) {
    case "hours": {
      const currentHours24 = convertTo24Hour(time)
      const nextHours24 = (currentHours24 + 1) % 24
      const converted = convertTo12Hour(nextHours24)
      newTime.hours = converted.hours
      newTime.period = converted.period
      break
    }
    case "minutes":
      newTime.minutes = ((newTime.minutes ?? 0) + 1) % 60
      if (newTime.minutes === 0) {
        return incrementTimeValue(newTime, "hours")
      }
      break
    case "seconds":
      newTime.seconds = ((newTime.seconds ?? 0) + 1) % 60
      if (newTime.seconds === 0) {
        return incrementTimeValue(newTime, "minutes")
      }
      break
  }

  return newTime
}

export function decrementTimeValue(time: Time, type: "hours" | "minutes" | "seconds"): Time {
  const newTime = { ...time }

  switch (type) {
    case "hours": {
      const currentHours24 = convertTo24Hour(time)
      const nextHours24 = (currentHours24 - 1 + 24) % 24
      const converted = convertTo12Hour(nextHours24)
      newTime.hours = converted.hours
      newTime.period = converted.period
      break
    }
    case "minutes":
      if (newTime.minutes === 0) {
        newTime.minutes = 59
        return decrementTimeValue(newTime, "hours")
      }
      newTime.minutes = ((newTime.minutes ?? 0) - 1 + 60) % 60
      break
    case "seconds":
      if (newTime.seconds === 0) {
        newTime.seconds = 59
        return decrementTimeValue(newTime, "minutes")
      }
      newTime.seconds = ((newTime.seconds ?? 0) - 1 + 60) % 60
      break
  }

  return newTime
}

export function isTimeInRange(time: Time, minTime?: Time, maxTime?: Time): boolean {
  if (!minTime && !maxTime) return true

  const timeHours24 = convertTo24Hour(time)
  const minHours24 = minTime ? convertTo24Hour(minTime) : 0
  const maxHours24 = maxTime ? convertTo24Hour(maxTime) : 23

  const timeInMinutes = timeHours24 * 60 + (time.minutes || 0)
  const minTimeInMinutes = minHours24 * 60 + (minTime?.minutes || 0)
  const maxTimeInMinutes = maxHours24 * 60 + (maxTime?.minutes || 0)

  return timeInMinutes >= minTimeInMinutes && timeInMinutes <= maxTimeInMinutes
}

export function clampTime(time: Time, minTime?: Time, maxTime?: Time): Time {
  if (!minTime && !maxTime) return time

  const timeHours24 = convertTo24Hour(time)
  const minHours24 = minTime ? convertTo24Hour(minTime) : 0
  const maxHours24 = maxTime ? convertTo24Hour(maxTime) : 23

  const timeInMinutes = timeHours24 * 60 + (time.minutes || 0)
  const minTimeInMinutes = minHours24 * 60 + (minTime?.minutes || 0)
  const maxTimeInMinutes = maxHours24 * 60 + (maxTime?.minutes || 0)

  const clampedMinutes = Math.min(Math.max(timeInMinutes, minTimeInMinutes), maxTimeInMinutes)

  const clampedHours24 = Math.floor(clampedMinutes / 60)
  const clampedMinutesOnly = clampedMinutes % 60
  const converted = convertTo12Hour(clampedHours24)

  return {
    hours: converted.hours,
    minutes: clampedMinutesOnly,
    seconds: time.seconds || 0,
    period: converted.period,
  }
}

