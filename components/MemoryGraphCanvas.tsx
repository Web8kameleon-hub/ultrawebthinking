/**
 * MemoryGraphCanvas - EuroWeb Ultra Industrial Memory Visualization
 * Real-time memory graph with live data visualization
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version Ultra 8.0.0 Industrial
 * @license MIT
 */

import styles from "@/components/MemoryGraph.module.css";

export default function MemoryGraphCanvas() {
  return (
    <div className={styles.mgRoot}>
      <div className={styles.gridOverlay} />
      <div className={styles.mgViewport}>
        {/* svg layer */}
        <div className={styles.svgLayer}>
          <svg>
            {/* defs për gradient edges */}
            <defs>
              <linearGradient id="edge-live-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient id="edge-deg-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fda4af" />
              </linearGradient>
              <linearGradient id="edge-err-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>

            {/* shembull edge */}
            {/* <path className={`${styles.edge} ${styles.edgeLive}`} d="M10,100 C200,0 300,200 500,100" /> */}
          </svg>
        </div>

        {/* node shembull */}
        <div className={`${styles.node} ${styles["node--agi"]} ${styles.isOnline} ${styles.nodePos1}`}>
          <div className={styles.nodeTop} />
          <div className={styles.nodeTitle}>🧠 AGI Core</div>
          <div className={styles.nodeMeta}>
            <div>Mem: 21.2 GB / 63.8 GB</div>
            <div>Uptime: 7h 12m</div>
          </div>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgeRoyal}`}>REAL</span>
            <span className={`${styles.badge} ${styles.badgeOk}`}>HEALTH OK</span>
          </div>
          <span className={`${styles.port} ${styles["port--right"]} ${styles.portOnline}`} />
        </div>
      </div>

      {/* toolbar / inspector / legend (opsionale) */}
      <div className={`${styles.panel} ${styles.toolbar}`}>
        <button className={styles.toolBtn}>Center</button>
        <button className={styles.toolBtn}>Zoom In</button>
        <button className={styles.toolBtn}>Zoom Out</button>
      </div>
      <div className={`${styles.panel} ${styles.legend}`}>
        <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.legendOk}`} /> Online</div>
        <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.legendWarn}`} /> Degraded</div>
        <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.legendErr}`} /> Offline</div>
      </div>
    </div>
  );
}
