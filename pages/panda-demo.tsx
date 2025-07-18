// Demo page për Panda CSS theming system
import React from 'react';
import { css } from '..//css';
import { stack, container } from '..//patterns';
import AGIPanel, { AGIMetrics, AGIButton } from '../components/AGIPandaComponents';
import { agiCore } from '../lib/AGICore';

export default function PandaDemo() {
  const handleThemeChange = (theme: 'light' | 'dark' | 'nature') => {
    // Update theme in AGI memory
    const memory = agiCore.getMemory();
    memory.ui.theme = theme;
    agiCore.addAGIResponse(`Theme changed to ${theme}`, `UI theme updated to ${theme} successfully`);
  };

  const handleAGITest = () => {
    agiCore.addAGIResponse('Test input', 'Panda CSS integration successful!');
  };

  return (
    <div className={container({ maxW: '6xl' })}>
      <div className={stack({ direction: 'column', gap: '2xl', align: 'center' })}>
        
        {/* Header */}
        <div className={css({
          textAlign: 'center',
          paddingY: 'xl'
        })}>
          <h1 className={css({
            fontSize: '4xl',
            fontWeight: '700',
            background: 'linear-gradient(45deg, {colors.primary.500}, {colors.secondary.500}, {colors.accent.500})',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 'md'
          })}>
            🎨 Panda CSS + AGI Demo
          </h1>
          <p className={css({
            fontSize: 'lg',
            color: '{colors.neutral.600}',
            maxWidth: '600px',
            margin: '0 auto'
          })}>
            Interactive demo showcasing Panda CSS theming system with AGI-driven dynamic styling
          </p>
        </div>

        {/* Theme Switcher */}
        <div className={css({
          background: '{colors.neutral.50}',
          borderRadius: 'xl',
          padding: 'lg',
          border: '1px solid {colors.neutral.200}'
        })}>
          <h3 className={css({
            fontSize: 'lg',
            fontWeight: '600',
            marginBottom: 'md',
            textAlign: 'center',
            color: '{colors.neutral.700}'
          })}>
            🎭 Theme Switcher
          </h3>
          <div className={stack({ direction: 'row', gap: 'md', justify: 'center' })}>
            <AGIButton 
              variant="primary" 
              onClick={() => handleThemeChange('light')}
            >
              ☀️ Light
            </AGIButton>
            <AGIButton 
              variant="secondary" 
              onClick={() => handleThemeChange('nature')}
            >
              🌿 Nature
            </AGIButton>
            <AGIButton 
              variant="accent" 
              onClick={() => handleThemeChange('dark')}
            >
              🌙 Dark
            </AGIButton>
          </div>
        </div>

        {/* AGI Metrics */}
        <div className={css({
          width: '100%',
          background: '{colors.neutral.50}',
          borderRadius: 'xl',
          padding: 'xl',
          border: '1px solid {colors.neutral.200}'
        })}>
          <h3 className={css({
            fontSize: 'lg',
            fontWeight: '600',
            marginBottom: 'lg',
            textAlign: 'center',
            color: '{colors.neutral.700}'
          })}>
            📊 Real-time AGI Metrics
          </h3>
          <AGIMetrics />
        </div>

        {/* Interactive AGI Panel */}
        <div className={css({
          width: '100%',
          maxWidth: '500px'
        })}>
          <h3 className={css({
            fontSize: 'lg',
            fontWeight: '600',
            marginBottom: 'md',
            textAlign: 'center',
            color: '{colors.neutral.700}'
          })}>
            🧠 AGI Control Panel
          </h3>
          <AGIPanel>
            <AGIButton 
              variant="primary" 
              size="lg"
              onClick={handleAGITest}
            >
              🚀 Test AGI Response
            </AGIButton>
          </AGIPanel>
        </div>

        {/* Color Palette Demo */}
        <div className={css({
          width: '100%',
          background: '{colors.neutral.50}',
          borderRadius: 'xl',
          padding: 'xl',
          border: '1px solid {colors.neutral.200}'
        })}>
          <h3 className={css({
            fontSize: 'lg',
            fontWeight: '600',
            marginBottom: 'lg',
            textAlign: 'center',
            color: '{colors.neutral.700}'
          })}>
            🎨 Panda CSS Color Palette
          </h3>
          
          <div className={stack({ direction: 'column', gap: 'lg' })}>
            {/* Primary Colors */}
            <div>
              <h4 className={css({ fontSize: 'md', fontWeight: '600', marginBottom: 'sm', color: '{colors.neutral.600}' })}>
                Primary Colors
              </h4>
              <div className={stack({ direction: 'row', gap: 'sm' })}>
                {[50, 100, 500, 600, 900].map(shade => (
                  <div
                    key={shade}
                    className={css({
                      width: '60px',
                      height: '60px',
                      borderRadius: 'md',
                      background: `{colors.primary.${shade}}`,
                      border: '1px solid {colors.neutral.200}',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'xs',
                      fontWeight: '600',
                      color: shade > 500 ? 'white' : '{colors.neutral.700}'
                    })}
                  >
                    {shade}
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Colors */}
            <div>
              <h4 className={css({ fontSize: 'md', fontWeight: '600', marginBottom: 'sm', color: '{colors.neutral.600}' })}>
                Secondary Colors
              </h4>
              <div className={stack({ direction: 'row', gap: 'sm' })}>
                {[50, 100, 500, 600, 900].map(shade => (
                  <div
                    key={shade}
                    className={css({
                      width: '60px',
                      height: '60px',
                      borderRadius: 'md',
                      background: `{colors.secondary.${shade}}`,
                      border: '1px solid {colors.neutral.200}',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'xs',
                      fontWeight: '600',
                      color: shade > 500 ? 'white' : '{colors.neutral.700}'
                    })}
                  >
                    {shade}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Animation Showcase */}
        <div className={css({
          width: '100%',
          background: '{colors.neutral.50}',
          borderRadius: 'xl',
          padding: 'xl',
          border: '1px solid {colors.neutral.200}'
        })}>
          <h3 className={css({
            fontSize: 'lg',
            fontWeight: '600',
            marginBottom: 'lg',
            textAlign: 'center',
            color: '{colors.neutral.700}'
          })}>
            ✨ Animation Showcase
          </h3>
          
          <div className={stack({ direction: 'row', gap: 'lg', justify: 'center' })}>
            <div className={css({
              width: '80px',
              height: '80px',
              borderRadius: 'full',
              background: 'linear-gradient(45deg, {colors.primary.500}, {colors.secondary.500})',
              animation: 'pulse 2s infinite'
            })} />
            
            <div className={css({
              width: '80px',
              height: '80px',
              borderRadius: 'full',
              background: 'linear-gradient(45deg, {colors.accent.500}, {colors.primary.500})',
              animation: 'glow 1.5s ease-in-out infinite'
            })} />
            
            <div className={css({
              width: '80px',
              height: '80px',
              borderRadius: 'full',
              background: 'linear-gradient(45deg, {colors.secondary.500}, {colors.accent.500})',
              animation: 'spin 3s linear infinite'
            })} />
          </div>
        </div>

      </div>
    </div>
  );
}
