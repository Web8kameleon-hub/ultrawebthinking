/**
 * EuroWeb Ultra - Inline Styles  Component
 * strates UltraThemeEngine with pure inline styles
 */

import React from 'react';
import { useColors, useInlineStyles } from '../themes/hooks';

const UltraDemo: React.FC = () => {
  const styles = useInlineStyles();
  const colors = useColors();

  return (
    <div style={styles.layout.glassBg}>
      <div style={{ ...styles.layout.container, paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            ...styles.text.gradient, 
            fontSize: '3rem', 
            marginBottom: '1rem',
            ...styles.animations.fadeIn 
          }}>
            🚀 EuroWeb Ultra
          </h1>
          <p style={{ 
            ...styles.text.secondary, 
            fontSize: '1.25rem', 
            marginBottom: '2rem' 
          }}>
            Industrial-grade theming system with inline styles
          </p>
          
          {/* Button  */}
          <div style={{ ...styles.layout.flexCenter, gap: '1rem', flexWrap: 'wrap' }}>
            <button style={styles.button.primary}>
              🏰 Primary Royal
            </button>
            <button style={styles.button.secondary}>
              🌊 Secondary Glass
            </button>
            <button style={styles.button.ghost}>
              👻 Ghost Mode
            </button>
          </div>
        </div>

        {/* Cards  */}
        <div style={{ 
          ...styles.layout.grid, 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          marginBottom: '3rem'
        }}>
          {/* Default Card */}
          <div style={{ ...styles.card.default, padding: '2rem' }}>
            <h3 style={{ ...styles.text.primary, marginBottom: '1rem' }}>
              🌐 Default Glass Card
            </h3>
            <p style={styles.text.secondary}>
              Ultra glass effect with backdrop blur and royal borders.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button style={{ ...styles.button.secondary, padding: '0.5rem 1rem' }}>
                Learn More
              </button>
            </div>
          </div>

          {/* Royal Card */}
          <div style={{ ...styles.card.royal, padding: '2rem' }}>
            <h3 style={{ ...styles.text.royal, marginBottom: '1rem' }}>
              👑 Royal Gold Card
            </h3>
            <p style={styles.text.secondary}>
              Premium royal styling with gold accents and enhanced glow.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button style={{ ...styles.button.primary, padding: '0.5rem 1rem' }}>
                Upgrade
              </button>
            </div>
          </div>

          {/* Flat Card */}
          <div style={{ ...styles.card.flat, padding: '2rem' }}>
            <h3 style={{ ...styles.text.primary, marginBottom: '1rem' }}>
              📱 Flat Design Card
            </h3>
            <p style={styles.text.secondary}>
              Clean, minimal styling for modern interfaces.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button style={{ ...styles.button.ghost, padding: '0.5rem 1rem' }}>
                Explore
              </button>
            </div>
          </div>
        </div>

        {/* Input  */}
        <div style={{ ...styles.card.default, padding: '2rem', marginBottom: '3rem' }}>
          <h3 style={{ ...styles.text.primary, marginBottom: '1.5rem' }}>
            🎛️ Input Components
          </h3>
          <div style={{ ...styles.layout.grid, gap: '1rem' }}>
            <input 
              style={styles.input.default}
 placeholder="Default glass input..."
            />
            <input 
              style={styles.input.royal}
 placeholder="Royal gold input..."
            />
          </div>
        </div>

        {/* Animation  */}
        <div style={{ ...styles.card.royal, padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ ...styles.text.gradient, marginBottom: '1.5rem' }}>
            ⚡ Animation Showcase
          </h3>
          <div style={{ ...styles.layout.flexCenter, gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ 
              ...styles.animations.float,
              padding: '1rem',
              background: colors.gradients.royal,
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              🚀
            </div>
            <div style={{ 
              ...styles.animations.glow,
              padding: '1rem',
              background: colors.bg.glass,
              border: `2px solid ${colors.royal.gold}`,
              borderRadius: '1rem',
              fontSize: '1.5rem'
            }}>
              ✨ Glow Effect
            </div>
            <div style={{ 
              ...styles.animations.pulse,
              padding: '1rem',
              background: colors.gradients.glass,
              borderRadius: '1rem',
              fontSize: '1.5rem',
              color: colors.text.primary
            }}>
              💫 Pulse
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div style={{ 
          ...styles.layout.flexBetween, 
          marginTop: '3rem',
          padding: '1rem',
          ...styles.layout.glassPanel,
          borderRadius: '1rem'
        }}>
          <span style={styles.text.secondary}>
            🧠 UltraThemeEngine v8.0 - Inline Styles Edition
          </span>
          <span style={styles.text.royal}>
            ⚡ Zero CSS Classes • 🎨 Pure Inline • 🚀 Industrial Grade
          </span>
        </div>
      </div>
    </div>
  );
};

export default UltraDemo;

