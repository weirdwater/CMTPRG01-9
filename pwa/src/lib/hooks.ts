import { useRef, useEffect } from 'react'

export const usePrevious = <a>(value: a) => {
  const ref = useRef<a>()

  useEffect(() => {
    ref.current = value
  })

  return ref.current;
}


