/**
 * Neural Activity Demo Page
 * Real-time AGI neural network monitoring and visualization
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

import React from 'react';
import NeuralDashboard from '@/components/NeuralDashboard';

export default function NeuralDemo() {
  return (
    <div>
      <NeuralDashboard />
    </div>
  );
}

export const metadata = {
  title: 'Neural Activity Dashboard - EuroWeb Platform',
  description: 'Real-time AGI neural network monitoring with n1 and n7 pulse detection',
  keywords: 'neural network, agi, artificial intelligence, monitoring, n1, n7, pulse detection'
};
