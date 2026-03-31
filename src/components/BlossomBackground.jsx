import { useEffect, useRef } from 'react'

const PETAL_COLORS = ['#ffb3d1','#ff85b3','#fce7f3','#ff5c96','#ffe0ee','#f9a8c9']

export default function BlossomBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Gradient orbs
    const orbs = [
      { size: 400, x: '10%', y: '5%', color: '#ffe0ee', dur: 8 },
      { size: 300, x: '70%', y: '20%', color: '#fce7f3', dur: 12 },
      { size: 350, x: '40%', y: '70%', color: '#ffb3d1', dur: 10 },
    ]
    orbs.forEach(o => {
      const el = document.createElement('div')
      el.className = 'gradient-orb'
      el.style.cssText = `width:${o.size}px;height:${o.size}px;left:${o.x};top:${o.y};background:${o.color};animation-duration:${o.dur}s;`
      container.appendChild(el)
    })

    // Petals
    const createPetal = () => {
      const el = document.createElement('div')
      el.className = 'petal'
      const size = 8 + Math.random() * 10
      el.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        top:-20px;
        background:${PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]};
        animation-duration:${6 + Math.random() * 10}s;
        animation-delay:${Math.random() * 8}s;
        opacity:0.6;
        border-radius:${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
      `
      container.appendChild(el)
      setTimeout(() => { if (container.contains(el)) container.removeChild(el) }, 18000)
    }

    // Initial petals
    for (let i = 0; i < 15; i++) createPetal()
    const interval = setInterval(createPetal, 1200)

    return () => {
      clearInterval(interval)
      // cleanup orbs
      orbs.forEach(() => {
        const orb = container.querySelector('.gradient-orb')
        if (orb) container.removeChild(orb)
      })
    }
  }, [])

  return <div className="blossom-bg" ref={containerRef} />
}
