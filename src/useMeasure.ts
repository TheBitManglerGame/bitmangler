import { useRef, useState, useLayoutEffect } from 'react'

interface Bounds {
  width: number
  height: number
  top: number
  left: number
}

export const useMeasure = (): [{ ref: React.MutableRefObject<HTMLDivElement | null> }, Bounds] => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [bounds, setBounds] = useState<Bounds>({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  })

  useLayoutEffect(() => {
    const updateBounds: () => void = () => {
      if (ref.current) {
        setBounds(ref.current.getBoundingClientRect())
      }
    }
    updateBounds()
    const handleResize = (): void => {
      updateBounds()
    }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize) }
  }, [])

  return [{ ref }, bounds]
}
