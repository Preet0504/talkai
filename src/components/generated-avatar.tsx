"use client"

import React, { useMemo, useState } from "react"

interface GeneratedAvatarProps {
  seed?: string | null
  className?: string
  alt?: string
}

function initialsFrom(seed: string) {
  return (
    seed
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((t) => t[0].toUpperCase())
      .join("") || "?"
  )
}

export function GeneratedAvatar({ seed, className = "w-8 h-8 rounded-full", alt }: GeneratedAvatarProps) {
  const [errored, setErrored] = useState(false)
  const text = seed || "unknown"

  const src = useMemo(() => {
    try {
      const params = new URLSearchParams({
        seed: text,
        // You can add style params here, for example:
        // backgroundType: "solid",
        // flip: "true",
      })
      return `https://api.dicebear.com/7.x/bottts/svg?${params.toString()}`
    } catch {
      return undefined
    }
  }, [text])

  const initials = initialsFrom(text)

  if (!src || errored) {
    // fallback initials avatar (deterministic color)
    const hue = Array.from(text).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360
    const bg = `hsl(${hue},60%,50%)`
    return (
      <div
        role="img"
        aria-label={alt || text}
        style={{ backgroundColor: bg }}
        className={`${className} flex items-center justify-center text-white select-none`}
      >
        <span className="font-medium">{initials}</span>
      </div>
    )
  }

  return (
    // use a plain img to avoid Next.js image config requirements
    // referrerPolicy set to no-referrer to avoid leaking origin
    <img
      src={src}
      alt={alt || text}
      className={className}
      onError={() => setErrored(true)}
      referrerPolicy="no-referrer"
    />
  )
}

export default GeneratedAvatar
