"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      try {
        // Initialize mermaid with configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            primaryColor: "#3b82f6",
            primaryTextColor: "#1f2937",
            primaryBorderColor: "#e5e7eb",
            lineColor: "#6b7280",
            secondaryColor: "#f3f4f6",
            tertiaryColor: "#f9fafb",
            background: "#ffffff",
            mainBkg: "#ffffff",
            secondBkg: "#f3f4f6",
          },
          // Enable pan and zoom controls
          gantt: {
            useMaxWidth: false,
          },
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
          },
          sequence: {
            useMaxWidth: false,
          },
          // Set larger default width
          maxTextSize: 90000,
          maxEdges: 200,
        })

        // Generate unique ID for each diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        
        // Render the diagram
        mermaid.render(id, chart).then((result) => {
          if (ref.current) {
            ref.current.innerHTML = result.svg
            
            // Add pan and zoom functionality
            const svg = ref.current.querySelector('svg')
            if (svg) {
              // Make SVG responsive but allow larger sizes
              svg.style.maxWidth = '100%'
              svg.style.height = 'auto'
              svg.style.cursor = 'grab'
              
              // Add zoom and pan controls
              let scale = 1
              let translateX = 0
              let translateY = 0
              let isDragging = false
              let lastX = 0
              let lastY = 0

              // Mouse wheel zoom
              const handleWheel = (e: WheelEvent) => {
                e.preventDefault()
                const rect = svg.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                
                const delta = e.deltaY > 0 ? 0.9 : 1.1
                const newScale = Math.max(0.1, Math.min(3, scale * delta))
                
                // Calculate new translation to zoom toward mouse position
                const scaleDiff = newScale - scale
                translateX -= (x - translateX) * (scaleDiff / scale)
                translateY -= (y - translateY) * (scaleDiff / scale)
                
                scale = newScale
                updateTransform()
              }

              // Mouse drag pan
              const handleMouseDown = (e: MouseEvent) => {
                isDragging = true
                lastX = e.clientX
                lastY = e.clientY
                svg.style.cursor = 'grabbing'
              }

              const handleMouseMove = (e: MouseEvent) => {
                if (isDragging) {
                  const deltaX = e.clientX - lastX
                  const deltaY = e.clientY - lastY
                  translateX += deltaX
                  translateY += deltaY
                  lastX = e.clientX
                  lastY = e.clientY
                  updateTransform()
                }
              }

              const handleMouseUp = () => {
                isDragging = false
                svg.style.cursor = 'grab'
              }

              const handleMouseLeave = () => {
                isDragging = false
                svg.style.cursor = 'grab'
              }

              // Double-click to reset zoom
              const handleDoubleClick = () => {
                scale = 1
                translateX = 0
                translateY = 0
                updateTransform()
              }

              function updateTransform() {
                if (svg) {
                  const g = svg.querySelector('g')
                  if (g) {
                    g.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
                    g.style.transformOrigin = '0 0'
                  }
                }
              }

              // Add event listeners
              svg.addEventListener('wheel', handleWheel)
              svg.addEventListener('mousedown', handleMouseDown)
              svg.addEventListener('mousemove', handleMouseMove)
              svg.addEventListener('mouseup', handleMouseUp)
              svg.addEventListener('mouseleave', handleMouseLeave)
              svg.addEventListener('dblclick', handleDoubleClick)

              // Cleanup function
              return () => {
                svg.removeEventListener('wheel', handleWheel)
                svg.removeEventListener('mousedown', handleMouseDown)
                svg.removeEventListener('mousemove', handleMouseMove)
                svg.removeEventListener('mouseup', handleMouseUp)
                svg.removeEventListener('mouseleave', handleMouseLeave)
                svg.removeEventListener('dblclick', handleDoubleClick)
              }
            }
          }
        }).catch((error) => {
          console.error("Mermaid rendering error:", error)
          if (ref.current) {
            ref.current.innerHTML = `<pre class="bg-red-50 border border-red-200 p-4 rounded text-red-700">Error rendering diagram: ${error.message}</pre>`
          }
        })
      } catch (error) {
        console.error("Mermaid initialization error:", error)
        if (ref.current) {
          ref.current.innerHTML = `<pre class="bg-red-50 border border-red-200 p-4 rounded text-red-700">Error initializing Mermaid: ${error}</pre>`
        }
      }
    }
  }, [chart])

  return (
    <div className="my-8 -mx-4 md:-mx-8 lg:-mx-16 xl:-mx-24">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm overflow-hidden">
        <div 
          ref={ref} 
          className="w-full min-h-[400px] flex justify-center items-center relative"
        />
        <div className="text-xs text-gray-500 text-center mt-2 border-t pt-2">
          <span className="inline-flex items-center gap-2">
            <span>💡 Tip:</span>
            <span>Scroll to zoom • Drag to pan • Double-click to reset</span>
          </span>
        </div>
      </div>
    </div>
  )
}