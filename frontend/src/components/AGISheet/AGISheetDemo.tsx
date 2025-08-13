import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { CellEngine } from '../AGISheet/CellEngine';
import { FormulaEngine } from '../AGISheet/FormulaEngine';
import styles from './AGISheetDemo.module.css';

const demoVariants = cva(styles.demo, {
  variants: {
    theme: {
      industrial: styles.industrial,
      medical: styles.medical,
      educational: styles.educational,
      corporate: styles.corporate
    }
  },
  defaultVariants: {
    theme: 'industrial'
  }
});

interface AGISheetDemoProps {
  theme?: 'industrial' | 'medical' | 'educational' | 'corporate';
}

export const AGISheetDemo = ({ theme = 'industrial' }: AGISheetDemoProps) => {
  const cellEngine = new CellEngine();
  const formulaEngine = new FormulaEngine();

  const demoData = [
    {
      title: '🧠 AGI Commands',
      examples: [
        'agi:analyze "This is a test document for sentiment analysis"',
        'agi:translate "Hello world" to sq',
        'agi:summarize "Long document text here..."',
        'agi:calculate A1+B1*2'
      ]
    },
    {
      title: '📊 Excel Formulas',
      examples: [
        '=SUM(A1:A5)',
        '=AVERAGE(B1:B10)',
        '=IF(C1>100,"High","Low")',
        '=CONCAT(D1," - ",E1)'
      ]
    },
    {
      title: '🔬 Advanced Functions',
      examples: [
        '=SENTIMENT("I love this product!")',
        '=WORDCOUNT("Count words in this text")',
        '=LANGUAGE("Përshëndetje nga Shqipëria")',
        '=NOW()'
      ]
    }
  ];

  return (
    <motion.div
      className={demoVariants({ theme })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.header 
        className={styles.header}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className={styles.title}>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            🧠
          </motion.span>
          AGISheet Demo
        </h1>
        <p className={styles.subtitle}>
          Excel + Word + Media + AGI në një platformë të vetme
        </p>
      </motion.header>

      <div className={styles.grid}>
        {demoData.map((section, index) => (
          <motion.section
            key={section.title}
            className={styles.section}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <div className={styles.examples}>
              {section.examples.map((example, exampleIndex) => (
                <motion.div
                  key={exampleIndex}
                  className={styles.example}
                  whileHover={{ 
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    scale: 1.02
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <code className={styles.code}>{example}</code>
                  <motion.button
                    className={styles.tryButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      console.log(`Trying: ${example}`);
                      // Here you would actually execute the example
                    }}
                  >
                    Try ⚡
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <motion.div
        className={styles.features}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className={styles.featuresTitle}>Karakteristikat Kryesore</h2>
        <div className={styles.featureGrid}>
          {[
            { icon: '🧠', title: 'AGI Integration', desc: 'Inteligjencë artificiale në çdo qelizë' },
            { icon: '📊', title: 'Excel Compatible', desc: 'Të gjitha formulat e Excel' },
            { icon: '📝', title: 'Word Editor', desc: 'Editor i plotë teksti në qeliza' },
            { icon: '🎬', title: 'Media Support', desc: 'Video, audio, imazhe' },
            { icon: '🌍', title: 'Multi-Language', desc: 'Mbështet shumë gjuhë' },
            { icon: '⚡', title: 'Real-time', desc: 'Përditësime në kohë reale' }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.feature}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
              }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className={styles.footerText}>
          Powered by <strong>Web8</strong> • TypeScript + CVA + Framer Motion
        </p>
        <motion.div
          className={styles.status}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡ AGI Ready • 🧠 {cellEngine ? 'Engine Active' : 'Engine Loading'} • 📊 {formulaEngine ? 'Formulas Ready' : 'Loading Formulas'}
        </motion.div>
      </motion.footer>
    </motion.div>
  );
};
