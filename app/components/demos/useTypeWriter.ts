'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface TypeWriterOptions {
  speed?: number
  startDelay?: number
  onComplete?: () => void
}

export function useTypeWriter(
  text: string,
  options: TypeWriterOptions = {}
) {
  const { speed = 50, startDelay = 0, onComplete } = options
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const indexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    indexRef.current = 0
    setDisplayText('')
    setIsComplete(false)
    setIsStarted(false)
  }, [])

  const start = useCallback(() => {
    reset()
    setIsStarted(true)
  }, [reset])

  useEffect(() => {
    if (!isStarted) return

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        indexRef.current++
        setDisplayText(text.slice(0, indexRef.current))
        timeoutRef.current = setTimeout(typeNextChar, speed + Math.random() * 20)
      } else {
        setIsComplete(true)
        onComplete?.()
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, startDelay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isStarted, text, speed, startDelay, onComplete])

  return { displayText, isComplete, isStarted, reset, start }
}

export function useAnimationSequence() {
  const [step, setStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
  }, [])

  const reset = useCallback(() => {
    clearTimeouts()
    setStep(0)
    setIsRunning(false)
  }, [clearTimeouts])

  const start = useCallback(() => {
    reset()
    setIsRunning(true)
    setStep(1)
  }, [reset])

  const nextStep = useCallback(() => {
    setStep(s => s + 1)
  }, [])

  const delayedNextStep = useCallback((delay: number) => {
    const timeout = setTimeout(() => {
      setStep(s => s + 1)
    }, delay)
    timeoutsRef.current.push(timeout)
  }, [])

  useEffect(() => {
    return () => clearTimeouts()
  }, [clearTimeouts])

  return { step, isRunning, reset, start, nextStep, delayedNextStep }
}
