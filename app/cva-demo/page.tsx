/**
 * EuroWeb Web8 - CVA Dynamic Components 
 * Class Variance Authority - Industrial Component System
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @license MIT
 * @version 8.0.1 Industrial
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DynamicComponentFactory, 
  IndustrialPresets,
  buttonVariants,
  cardVariants,
  textVariants,
  layoutVariants 
} from '../../lib/DynamicComponents';

/**
 * CVA  Page Component
 */
const CVAage = (): React.ReactElement => {
  return (
    <div className={layoutVariants({
      display: 'flex',
      direction: 'col',
      gap: 'xl',
      padding: 'xl'
    })}>
      
      {/* Page Title */}
      <motion.h1 
        className={textVariants({
          variant: 'agi',
          size: '4xl',
          weight: 'bold',
          align: 'center'
        })}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎨 CVA Dynamic Components
      </motion.h1>

      {/* Button Variants Section */}
      <motion.section 
        className={cardVariants({
          variant: 'industrial',
          padding: 'lg',
          shadow: 'xl'
        })}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className={textVariants({
          variant: 'industrial',
          size: '2xl',
          weight: 'semibold'
        })}>
          🔘 Button Variants
        </h2>
        
        <div className={layoutVariants({
          display: 'flex',
          gap: 'md',
          padding: 'md'
        })}>
          <button className={buttonVariants({ variant: 'primary', size: 'md' })}>
            Primary
          </button>
          <button className={buttonVariants({ variant: 'agi', size: 'lg' })}>
            AGI Button
          </button>
          <button className={buttonVariants({ variant: 'industrial', size: 'xl' })}>
            Industrial
          </button>
          <button className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Ghost
          </button>
        </div>
      </motion.section>

      {/* Card Variants Section */}
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className={textVariants({
          variant: 'agi',
          size: '2xl',
          weight: 'semibold'
        })}>
          🃏 Card Variants
        </h2>
        
        <div className={layoutVariants({
          display: 'grid',
          gap: 'lg',
          padding: 'md'
        })}>
          <div className={cardVariants({ variant: 'default', padding: 'md' })}>
            <p className={textVariants({ variant: 'default' })}>Default Card</p>
          </div>
          
          <div className={cardVariants({ variant: 'dark', padding: 'lg' })}>
            <p className={textVariants({ variant: 'industrial' })}>Dark Card</p>
          </div>
          
          <div className={cardVariants({ variant: 'agi', padding: 'xl' })}>
            <p className={textVariants({ variant: 'agi', weight: 'bold' })}>AGI Card</p>
          </div>
          
          <div className={cardVariants({ variant: 'glass', padding: 'lg' })}>
            <p className={textVariants({ variant: 'industrial' })}>Glass Card</p>
          </div>
        </div>
      </motion.section>

      {/* Text Variants Section */}
      <motion.section 
        className={cardVariants({
          variant: 'dark',
          padding: 'lg'
        })}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className={textVariants({
          variant: 'accent',
          size: '2xl',
          weight: 'semibold'
        })}>
          📝 Text Variants
        </h2>
        
        <div className={layoutVariants({
          display: 'flex',
          direction: 'col',
          gap: 'sm',
          padding: 'md'
        })}>
          <p className={textVariants({ variant: 'default', size: 'lg' })}>
            Default Text
          </p>
          <p className={textVariants({ variant: 'muted', size: 'base' })}>
            Muted Text
          </p>
          <p className={textVariants({ variant: 'accent', size: 'lg', weight: 'bold' })}>
            Accent Text
          </p>
          <p className={textVariants({ variant: 'agi', size: 'xl', weight: 'bold' })}>
            AGI Gradient Text
          </p>
          <p className={textVariants({ variant: 'success', size: 'lg' })}>
            Success Text
          </p>
          <p className={textVariants({ variant: 'warning', size: 'lg' })}>
            Warning Text
          </p>
        </div>
      </motion.section>

      {/* Layout Variants Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className={textVariants({
          variant: 'industrial',
          size: '2xl',
          weight: 'semibold'
        })}>
          📐 Layout Variants
        </h2>
        
        {/* Flex Layout */}
        <div className={layoutVariants({
          display: 'flex',
          justify: 'between',
          align: 'center',
          gap: 'md',
          padding: 'md'
        })}>
          <div className={cardVariants({ variant: 'industrial', padding: 'sm' })}>
            <p className={textVariants({ variant: 'industrial' })}>Flex Start</p>
          </div>
          <div className={cardVariants({ variant: 'agi', padding: 'sm' })}>
            <p className={textVariants({ variant: 'agi' })}>Flex Center</p>
          </div>
          <div className={cardVariants({ variant: 'glass', padding: 'sm' })}>
            <p className={textVariants({ variant: 'industrial' })}>Flex End</p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className={layoutVariants({
          display: 'grid',
          gap: 'lg',
          padding: 'lg'
        })}>
          <div className={cardVariants({ variant: 'default', padding: 'md' })}>
            <p className={textVariants({ variant: 'default' })}>Grid Item 1</p>
          </div>
          <div className={cardVariants({ variant: 'dark', padding: 'md' })}>
            <p className={textVariants({ variant: 'industrial' })}>Grid Item 2</p>
          </div>
          <div className={cardVariants({ variant: 'agi', padding: 'md' })}>
            <p className={textVariants({ variant: 'agi' })}>Grid Item 3</p>
          </div>
        </div>
      </motion.section>

      {/* Industrial Presets Section */}
      <motion.section 
        className={cardVariants({
          variant: 'agi',
          padding: 'xl',
          shadow: 'xl'
        })}
        initial={{ opacity: 0, rotateY: -10 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <h2 className={textVariants({
          variant: 'agi',
          size: '3xl',
          weight: 'bold',
          align: 'center'
        })}>
          🏭 Industrial Presets
        </h2>
        
        <div className={layoutVariants({
          display: 'flex',
          direction: 'col',
          gap: 'lg',
          padding: 'lg',
          align: 'center'
        })}>
          <button className={buttonVariants(IndustrialPresets.AGIButton)}>
            AGI Preset Button
          </button>
          
          <p className={textVariants(IndustrialPresets.AGITitle)}>
            AGI Preset Title
          </p>
          
          <div className={cardVariants(IndustrialPresets.IndustrialCard)}>
            <p className={textVariants({ variant: 'industrial', align: 'center' })}>
              Industrial Preset Card
            </p>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export { CVAage };

