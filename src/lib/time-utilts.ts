import type { Time, TimeFormat } from "@/types/components/custom-times.types"

export function formatTime(time: Time | null | undefined, format: TimeFormat = "12h"): string {
  if (!time) return "--:--:--"

  const hours = format === "24h" ? convertTo24Hour(time) : time.hours
  return `${hours.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}${format === "12h" ? ` ${time.period}` : ""}`
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
    case "hours":
      newTime.hours = (newTime.hours + 1) % 24
      if (newTime.hours === 0 || newTime.hours === 12) {
        newTime.period = newTime.period === "AM" ? "PM" : "AM"
      }
      break
    case "minutes":
      newTime.minutes = (newTime.minutes + 1) % 60
      if (newTime.minutes === 0) {
        return incrementTimeValue(newTime, "hours")
      }
      break
    case "seconds":
      newTime.seconds = (newTime.seconds + 1) % 60
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
    case "hours":
      newTime.hours = (newTime.hours - 1 + 24) % 24
      if (newTime.hours === 11 || newTime.hours === 23) {
        newTime.period = newTime.period === "AM" ? "PM" : "AM"
      }
      break
    case "minutes":
      if (newTime.minutes === 0) {
        newTime.minutes = 59
        return decrementTimeValue(newTime, "hours")
      }
      newTime.minutes = (newTime.minutes - 1 + 60) % 60
      break
    case "seconds":
      if (newTime.seconds === 0) {
        newTime.seconds = 59
        return decrementTimeValue(newTime, "minutes")
      }
      newTime.seconds = (newTime.seconds - 1 + 60) % 60
      break
  }

  return newTime
}

export function isTimeInRange(time: Time, minTime?: Time, maxTime?: Time): boolean {
  if (!minTime && !maxTime) return true

  const timeValue = timeToMinutes(time)
  const minValue = minTime ? timeToMinutes(minTime) : 0
  const maxValue = maxTime ? timeToMinutes(maxTime) : 24 * 60 - 1

  return timeValue >= minValue && timeValue <= maxValue
}

export function clampTime(time: Time, minTime?: Time, maxTime?: Time): Time {
  if (!minTime && !maxTime) return time

  const timeValue = timeToMinutes(time)
  const minValue = minTime ? timeToMinutes(minTime) : 0
  const maxValue = maxTime ? timeToMinutes(maxTime) : 24 * 60 - 1

  const clampedValue = Math.min(Math.max(timeValue, minValue), maxValue)
  return minutesToTime(clampedValue)
}

function timeToMinutes(time: Time): number {
  const hours24 = convertTo24Hour(time)
  return hours24 * 60 + time.minutes
}

function minutesToTime(minutes: number): Time {
  let hours = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  let period: "AM" | "PM" = hours < 12 ? "AM" : "PM"

  // Convertir a formato 12 horas
  if (hours === 0) {
    hours = 12
    period = "AM"
  } else if (hours > 12) {
    hours = hours - 12
    period = "PM"
  } else if (hours === 12) {
    period = "PM"
  }

  return {
    hours,
    minutes: mins,
    seconds: 0,
    period,
  }
}

export function convertTo24Hour(time: Time): number {
  if (time.period === "PM") {
    return time.hours === 12 ? 12 : time.hours + 12
  }
  return time.hours === 12 ? 0 : time.hours
}

export function parseTimeString(timeStr: string | null | undefined): Time | null {
  if (typeof timeStr !== "string" || !timeStr) return null

  const match = timeStr.match(/^(\d{1,2}):(\d{2}):(\d{2})(?: (AM|PM))?$/)
  if (!match) return null

  const [, hours, minutes, seconds] = match
  const parsedHours = Number.parseInt(hours, 10)
  const parsedMinutes = Number.parseInt(minutes, 10)
  const parsedSeconds = Number.parseInt(seconds, 10)

  if (
    isNaN(parsedHours) ||
    isNaN(parsedMinutes) ||
    isNaN(parsedSeconds) ||
    parsedHours < 0 ||
    parsedHours > 23 ||
    parsedMinutes < 0 ||
    parsedMinutes > 59 ||
    parsedSeconds < 0 ||
    parsedSeconds > 59
  ) {
    return null
  }

  // Convertir a formato 12 horas
  let adjustedHours = parsedHours
  let adjustedPeriod: "AM" | "PM"

  if (parsedHours >= 12) {
    adjustedPeriod = "PM"
    adjustedHours = parsedHours === 12 ? 12 : parsedHours - 12
  } else {
    adjustedPeriod = "AM"
    adjustedHours = parsedHours === 0 ? 12 : parsedHours
  }

  return {
    hours: adjustedHours,
    minutes: parsedMinutes,
    seconds: parsedSeconds,
    period: adjustedPeriod,
  }
}

export function formatTimeToString(time: Time | null): string {
  if (!time) return ""
  const hours24 = convertTo24Hour(time)
  return `${hours24.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`
}

export function parseTimeRange(rangeStr: string): { from: Time | null; to: Time | null } {
  try {
    const { from, to } = JSON.parse(rangeStr)
    return {
      from: parseTimeString(from),
      to: parseTimeString(to),
    }
  } catch {
    return {
      from: null,
      to: null,
    }
  }
}

export const convertToISODate = (dateString: string | { from?: string; to?: string } | null | undefined): string => {
  if (!dateString) {
    return new Date().toISOString()
  }
  if (typeof dateString === "object") {
    dateString = dateString.from || dateString.to || ""
  }
  if (typeof dateString !== "string") {
    return new Date().toISOString()
  }
  const parts = dateString.split("-")
  if (parts.length !== 3) {
    return new Date().toISOString()
  }
  const [day, month, year] = parts
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day), 12, 0, 0)
  return date.toISOString()
}

export function formatTimeRange(from: Time, to: Time): string {
  return JSON.stringify({
    from: formatTimeToString(from),
    to: formatTimeToString(to),
  })
}

