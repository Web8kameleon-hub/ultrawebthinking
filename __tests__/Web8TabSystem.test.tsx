import { render, screen, fireEvent, waitFor } from '@/uireact';
import '@/ui-dom';
import Web8TabSystem from '../components/Web8TabSystem';

describe('Web8TabSystem', () => {
  test('renders the tab navigation', () => {
    render(<Web8TabSystem />);
    
    // Check if main tabs are rendered
    expect(screen.getByText('Search Machine')).toBeInTheDocument();
    expect(screen.getByText('Data/Dita/Ora')).toBeInTheDocument();
    expect(screen.getByText('AGI Status')).toBeInTheDocument();
    expect(screen.getByText('GISheet')).toBeInTheDocument();
  });

  test('switches between tabs correctly', async () => {
    render(<Web8TabSystem />);
    
    // Initial state should show Search Machine
    expect(screen.getByText('🔍 Web8 Search Machine')).toBeInTheDocument();
    
    // Click on AGI Status tab
    fireEvent.click(screen.getByText('AGI Status'));
    
    waitFor(() => {
      expect(screen.getByText('🧠 AGI Status')).toBeInTheDocument();
    });
  });

  test('AGISheet component renders correctly', async () => {
    render(<Web8TabSystem />);
    
    // Click on GISheet tab
    fireEvent.click(screen.getByText('GISheet'));
    
    waitFor(() => {
      expect(screen.getByText('📋 AGISheet - Kameleoni i Inteligjencës')).toBeInTheDocument();
      expect(screen.getByText('🌍 Workspace (Kameleoni)')).toBeInTheDocument();
      expect(screen.getByText('👁️ View Mode')).toBeInTheDocument();
    });
  });

  test('AGISheet grid view functionality', async () => {
    render(<Web8TabSystem />);
    
    // Navigate to GISheet
    fireEvent.click(screen.getByText('GISheet'));
    
    waitFor(() => {
      // Check if grid elements are present
      expect(screen.getByText('🔄 Auto-Refresh')).toBeInTheDocument();
      expect(screen.getByText('📊 AGI Analyze')).toBeInTheDocument();
      expect(screen.getByText('Layer')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  test('real-time updates work correctly', async () => {
    .useFakeTimers();
    render(<Web8TabSystem />);
    
    // Navigate to AGI Status tab
    fireEvent.click(screen.getByText('AGI Status'));
    
    // Fast-forward time to trigger updates
    .advanceTimersByTime(5000);
    
    waitFor(() => {
      expect(screen.getByText('🧠 AGI Status')).toBeInTheDocument();
    });
    
    .useRealTimers();
  });

  test('command center functionality in AGISheet', async () => {
    render(<Web8TabSystem />);
    
    // Navigate to GISheet
    fireEvent.click(screen.getByText('GISheet'));
    
    waitFor(() => {
      // Switch to command view
      fireEvent.click(screen.getByText('Command Center'));
      
      expect(screen.getByText('🎯 AGI Command Center')).toBeInTheDocument();
      expect(screen.getByText('🧠 Core AGI Commands')).toBeInTheDocument();
      expect(screen.getByText('core.initialize()')).toBeInTheDocument();
    });
  });

  test('workspace switching in AGISheet', async () => {
    render(<Web8TabSystem />);
    
    // Navigate to GISheet
    fireEvent.click(screen.getByText('GISheet'));
    
    waitFor(() => {
      // Click on different workspace
      fireEvent.click(screen.getByText('Operations Dashboard'));
      
      // Verify workspace is selected (component should handle this internally)
      expect(screen.getByText('Operations Dashboard')).toBeInTheDocument();
    });
  });
});
