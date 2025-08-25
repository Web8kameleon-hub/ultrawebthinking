/**
 * Aviation Weather Intelligence Issues & Roadmap
 * EuroWeb Platform - Aviation Module
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.3.0 Ultra
 * @license MIT
 */

import { WeatherIssue } from './types'

export const aviationWeatherIssues: WeatherIssue[] = [
    {
        key: "WEA-001",
        title: "Satellite Ingest (EUMETSAT tiles)",
        description: "Fetch IR/VIS imagery every 10–15 min, slice to XYZ tiles (256px), store to object store (MinIO/S3).",
        priority: "High",
        owner: "Weather Team",
        labels: "satellite,ingest,tiles",
        status: "backlog"
    },
    {
        key: "WEA-002",
        title: "METAR/TAF Parser & Storage",
        description: "Pull METAR/TAF for selected ICAOs, parse to structured fields (wind, vis, ceiling), store to Postgres/Timescale.",
        priority: "High",
        owner: "Aviation Team",
        labels: "metar,taf,db",
        status: "backlog"
    },
    {
        key: "WEA-003",
        title: "NWP Ingest (ECMWF/ICON/GFS)",
        description: "Download GRIB2 for EU region, crop by airport radius (75km), expose query for variables (wind, ceiling, precip).",
        priority: "High",
        owner: "Weather Team",
        labels: "nwp,grib,ecmwf,icon,gfs",
        status: "backlog"
    },
    {
        key: "WEA-004",
        title: "Nowcast Engine (0–2h)",
        description: "Optical flow (RAFT/LK) over last 3–6 SAT frames to project cloud/precip motion T+15/30/60/120.",
        priority: "High",
        owner: "AI Team",
        labels: "nowcast,oflow,gpu-optional",
        status: "backlog"
    },
    {
        key: "WEA-005",
        title: "Forecast Fusion",
        description: "Fuse SAT nowcast + NWP + TAF using Kalman/ensemble; compute runway winds (head/crosswind).",
        priority: "High",
        owner: "AI Team",
        labels: "fusion,runway,kalman",
        status: "backlog"
    },
    {
        key: "WEA-006",
        title: "Aviation Forecast API",
        description: "Endpoint: GET /api/aviation/v1/forecast/:icao?hours=0-48 with Airport Forecast Object JSON.",
        priority: "High",
        owner: "Platform Team",
        labels: "api,json",
        status: "backlog"
    },
    {
        key: "WEA-007",
        title: "Satellite Tile Server",
        description: "Serve /tiles/sat/{layer}/{z}/{x}/{y}.png with CDN cache 15m; layers=IR,VIS,cloud-top.",
        priority: "Medium",
        owner: "Platform Team",
        labels: "tiles,cdn,cache",
        status: "backlog"
    },
    {
        key: "WEA-008",
        title: "Frontend Layers & Airport Cards",
        description: "Map layers (SAT IR/VIS), time scrubber, airport search, risk badges (CB/ICE/TURB/LLWS), runway wind widget.",
        priority: "High",
        owner: "Web Team",
        labels: "ui,map,aviation",
        status: "backlog"
    },
    {
        key: "WEA-009",
        title: "Operational Brief PDF",
        description: "1-page PDF per airport: METAR/TAF, 0–2h nowcast, 6–24h outlook, runway winds, risks.",
        priority: "Medium",
        owner: "Web Team",
        labels: "pdf,report",
        status: "backlog"
    },
    {
        key: "WEA-010",
        title: "Observability & Freshness Alerts",
        description: "Prometheus/Grafana dashboards; alerts for data gaps, stale tiles, API latency > 200ms.",
        priority: "High",
        owner: "SRE Team",
        labels: "observability,alerts",
        status: "backlog"
    },
    {
        key: "WEA-011",
        title: "Licensing & Attribution Compliance",
        description: "Review SAT/NWP licenses, implement attribution and usage restrictions in UI/docs.",
        priority: "High",
        owner: "Legal/PM",
        labels: "compliance,licenses",
        status: "backlog"
    }
]

export const aviationMilestones = [
    {
        name: "Data Ingestion Foundation",
        weeks: "Week 1–2",
        issues: ["WEA-001", "WEA-002", "WEA-003"],
        description: "Satellite, METAR/TAF, and NWP ingests online with storage"
    },
    {
        name: "AI Processing Core",
        weeks: "Week 3–4",
        issues: ["WEA-004", "WEA-005"],
        description: "Nowcast engine and forecast fusion algorithms"
    },
    {
        name: "API & User Interface",
        weeks: "Week 5",
        issues: ["WEA-006", "WEA-007", "WEA-008", "WEA-009"],
        description: "Aviation API, tile server, frontend maps, and PDF reports"
    },
    {
        name: "Production Readiness",
        weeks: "Week 6",
        issues: ["WEA-010", "WEA-011"],
        description: "Observability, monitoring, and compliance"
    }
]
