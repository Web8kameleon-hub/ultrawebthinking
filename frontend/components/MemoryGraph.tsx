"use client"

import { useEffect, useRef } from "react"
import { css } from "@styled-system/css"
import * as d3 from "d3"

interface Node {
  id: string
  label: string
}

interface Link {
  source: string
  target: string
}

const nodes: Node[] = [
  { id: "agi", label: "AGI" },
  { id: "core", label: "Core" },
  { id: "sense", label: "Sense" },
  { id: "mind", label: "Mind" },
  { id: "memory", label: "Memory" },
  { id: "planner", label: "Planner" },
  { id: "response", label: "Response" },
]

const links: Link[] = [
  { source: "agi", target: "core" },
  { source: "core", target: "sense" },
  { source: "core", target: "mind" },
  { source: "mind", target: "memory" },
  { source: "memory", target: "planner" },
  { source: "planner", target: "response" },
]

export default function MemoryGraph() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(ref.current)
    const width = 600
    const height = 400

    svg.selectAll("*").remove()

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#888")
      .attr("stroke-width", 1.5)

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 18)
      .attr("fill", "#00ffe1")
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on("drag", (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )

    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.label)
      .attr("font-size", 12)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", 4)

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)
      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
    })
  }, [])

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: "6",
        px: "4",
        bg: "#0a0f1a",
        borderRadius: "2xl",
        my: "6",
        boxShadow: "0 0 30px rgba(0,255,255,0.05)",
      })}
    >
      <h2 className={css({ color: "white", fontSize: "xl", mb: "4", fontWeight: "semibold" })}>
        🧠 Vizualizimi i Kujtesës së AGI-së
      </h2>
      <svg ref={ref} width="600" height="400" />
    </section>
  )
}
