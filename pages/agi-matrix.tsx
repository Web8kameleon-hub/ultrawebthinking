import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { css } from 'styled-system/css';
import AGIMatrix from '../components/AGIMatrix';
import { 
  primaryColorVar,
  secondaryColorVar,
  backgroundColorVar,
  textColorVar,
  fadeInUp,
  morphingBackground,
  glassMorphism
} from '../styles/vanilla-extract.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

const AGIMatrixPage: NextPage = () => {
  const [theme, setTheme] = useState<'matrix' | 'neural' | 'quantum' | 'cyber'>('matrix');
  const [gridSize, setGridSize] = useState(20);
  const [showConnections, setShowConnections] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [selectedMatrix, setSelectedMatrix] = useState<any>(null);

  const themeConfigs = {
    matrix: {
      vars: {
        [primaryColorVar]: '#00ff41',
        [secondaryColorVar]: '#ff0040',
        [backgroundColorVar]: '#000000',
        [textColorVar]: '#00ff41'
      },
      name: 'Matrix Green',
      description: 'Classic matrix style with green on black'
    },
    neural: {
      vars: {
        [primaryColorVar]: '#ff6b6b',
        [secondaryColorVar]: '#4ecdc4',
        [backgroundColorVar]: '#2c3e50',
        [textColorVar]: '#ecf0f1'
      },
      name: 'Neural Network',
      description: 'Brain-inspired warm colors'
    },
    quantum: {
      vars: {
        [primaryColorVar]: '#8b5cf6',
        [secondaryColorVar]: '#06b6d4',
        [backgroundColorVar]: '#0f172a',
        [textColorVar]: '#f1f5f9'
      },
      name: 'Quantum Field',
      description: 'Purple and cyan quantum vibes'
    },
    cyber: {
      vars: {
        [primaryColorVar]: '#00ff00',
        [secondaryColorVar]: '#ff0080',
        [backgroundColorVar]: '#000000',
        [textColorVar]: '#00ff00'
      },
      name: 'Cyberpunk',
      description: 'Neon cyber aesthetic'
    }
  };

  const currentThemeConfig = themeConfigs[theme];

  return (
    <>
      <Head>
        <title>AGI Matrix - Advanced Neural Network Visualization</title>
        <meta name="description" content="Interactive AGI Matrix visualization showing neural network processing" />
      </Head>

      <div
        style={assignInlineVars(currentThemeConfig.vars)}
        className={css({
          minH: '100vh',
          bg: backgroundColorVar,
          color: textColorVar,
          fontFamily: 'mono',
          position: 'relative',
          overflow: 'hidden'
        })}
      >
        {/* Background Effect */}
        <div className={`${morphingBackground} ${css({
          position: 'fixed',
          inset: 0,
          opacity: 0.1,
          zIndex: 1
        })}`} />

        {/* Header */}
        <motion.header
          className={`${glassMorphism} ${css({
            position: 'relative',
            zIndex: 10,
            p: '6',
            textAlign: 'center',
            borderBottom: '1px solid',
            borderColor: primaryColorVar
          })}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            mb: '4',
            color: primaryColorVar,
            textShadow: '0 0 20px currentColor'
          })}>
            🧠 AGI Matrix
          </h1>
          <p className={css({
            fontSize: 'lg',
            opacity: 0.8,
            maxW: '2xl',
            mx: 'auto'
          })}>
            Interactive neural network visualization showing real-time AGI processing patterns
          </p>
        </motion.header>

        {/* Main Content */}
        <div className={css({
          position: 'relative',
          zIndex: 5,
          p: '6',
          display: 'flex',
          flexDirection: { base: 'column', lg: 'row' },
          gap: '6',
          alignItems: 'flex-start'
        })}>
          {/* Matrix Visualization */}
          <motion.div
            className={css({ flex: '1', display: 'flex', justifyContent: 'center' })}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <AGIMatrix
              width={800}
              height={600}
              gridSize={gridSize}
              theme={theme}
              autoUpdate={autoUpdate}
              interactive={true}
              showConnections={showConnections}
              onCellClick={(cell) => {
                console.log('Cell clicked:', cell);
              }}
              onMatrixUpdate={(matrix) => {
                setSelectedMatrix(matrix);
              }}
            />
          </motion.div>

          {/* Control Panel */}
          <motion.div
            className={`${glassMorphism} ${css({
              w: { base: 'full', lg: '80' },
              p: '6',
              borderRadius: 'lg',
              border: '1px solid',
              borderColor: primaryColorVar
            })}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className={css({
              fontSize: 'xl',
              fontWeight: 'bold',
              mb: '4',
              color: primaryColorVar
            })}>
              🎛️ Matrix Controls
            </h2>

            {/* Theme Selector */}
            <div className={css({ mb: '4' })}>
              <label className={css({
                display: 'block',
                mb: '2',
                fontSize: 'sm',
                fontWeight: 'medium'
              })}>
                🎨 Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className={css({
                  w: 'full',
                  p: '2',
                  bg: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid',
                  borderColor: primaryColorVar,
                  borderRadius: 'md',
                  color: textColorVar,
                  fontSize: 'sm'
                })}
              >
                {Object.entries(themeConfigs).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
              </select>
              <p className={css({ fontSize: 'xs', opacity: 0.7, mt: '1' })}>
                {currentThemeConfig.description}
              </p>
            </div>

            {/* Grid Size Slider */}
            <div className={css({ mb: '4' })}>
              <label className={css({
                display: 'block',
                mb: '2',
                fontSize: 'sm',
                fontWeight: 'medium'
              })}>
                📏 Cell Size: {gridSize}px
              </label>
              <input
                type="range"
                min="10"
                max="40"
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className={css({
                  w: 'full',
                  appearance: 'none',
                  h: '2',
                  bg: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 'full',
                  outline: 'none',
                  '&::-webkit-slider-thumb': {
                    appearance: 'none',
                    w: '4',
                    h: '4',
                    bg: primaryColorVar,
                    borderRadius: 'full',
                    cursor: 'pointer'
                  }
                })}
              />
            </div>

            {/* Toggle Controls */}
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '3', mb: '6' })}>
              <label className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                cursor: 'pointer',
                fontSize: 'sm'
              })}>
                <input
                  type="checkbox"
                  checked={showConnections}
                  onChange={(e) => setShowConnections(e.target.checked)}
                  className={css({
                    appearance: 'none',
                    w: '4',
                    h: '4',
                    border: '1px solid',
                    borderColor: primaryColorVar,
                    borderRadius: 'sm',
                    bg: showConnections ? primaryColorVar : 'transparent',
                    cursor: 'pointer'
                  })}
                />
                🔗 Show Connections
              </label>

              <label className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                cursor: 'pointer',
                fontSize: 'sm'
              })}>
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className={css({
                    appearance: 'none',
                    w: '4',
                    h: '4',
                    border: '1px solid',
                    borderColor: primaryColorVar,
                    borderRadius: 'sm',
                    bg: autoUpdate ? primaryColorVar : 'transparent',
                    cursor: 'pointer'
                  })}
                />
                ⚡ Auto Update
              </label>
            </div>

            {/* Matrix Stats */}
            {selectedMatrix && (
              <div className={css({
                p: '4',
                bg: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'md',
                fontSize: 'sm'
              })}>
                <h3 className={css({
                  fontSize: 'md',
                  fontWeight: 'bold',
                  mb: '2',
                  color: primaryColorVar
                })}>
                  📊 Matrix Statistics
                </h3>
                <div className={css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2' })}>
                  <div>Total Cells: {selectedMatrix.flat().length}</div>
                  <div>Active: {selectedMatrix.flat().filter((cell: any) => cell.isActive).length}</div>
                  <div>Data Cells: {selectedMatrix.flat().filter((cell: any) => cell.type === 'data').length}</div>
                  <div>Neural: {selectedMatrix.flat().filter((cell: any) => cell.type === 'neural').length}</div>
                  <div>Processing: {selectedMatrix.flat().filter((cell: any) => cell.type === 'processing').length}</div>
                  <div>Quantum: {selectedMatrix.flat().filter((cell: any) => cell.type === 'quantum').length}</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          className={`${glassMorphism} ${css({
            position: 'relative',
            zIndex: 10,
            mx: '6',
            mb: '6',
            p: '6',
            borderRadius: 'lg',
            border: '1px solid',
            borderColor: primaryColorVar
          })}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className={css({
            fontSize: 'xl',
            fontWeight: 'bold',
            mb: '4',
            color: primaryColorVar
          })}>
            🚀 How to Use AGI Matrix
          </h2>
          <div className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: '4',
            fontSize: 'sm'
          })}>
            <div>
              <strong>🖱️ Click Cells:</strong> Click any cell to select and view details
            </div>
            <div>
              <strong>🎨 Change Themes:</strong> Switch between Matrix, Neural, Quantum, and Cyber themes
            </div>
            <div>
              <strong>⚙️ Adjust Size:</strong> Use the slider to change cell size
            </div>
            <div>
              <strong>🚀 Activate:</strong> Click "Activate Matrix" to trigger processing waves
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AGIMatrixPage;
