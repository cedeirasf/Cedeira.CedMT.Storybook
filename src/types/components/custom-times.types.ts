export type TimeFormat = "12h" | "24h"
export type Period = "AM" | "PM"

export interface Time {
  hours: number
  minutes: number
  seconds: number
  period?: Period
}

