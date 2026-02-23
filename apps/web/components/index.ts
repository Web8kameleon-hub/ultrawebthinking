/**
 * EuroWeb Platform - Main Component Index
 * Central export hub for all platform components
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 3.0.0 Integrated
 * @license MIT
 */

// Main Tab System - Using Modern Web8TabSystem
export { default as ModernWeb8TabSystem } from '@/components/web8-tabs/ModernWeb8TabSystem'
export { Web8TabSystemFixed as Web8TabSystem } from '@/components/Web8TabSystem-fixed'

// AGI Office Components
export { default as AGIExcelEngine } from '@/components/agi-office/AGIExcelEngine'
export { default as AGIDocOffice } from '@/components/agi-office/AGIDocOffice'
export { default as AGISheetOffice } from '@/components/agi-office/AGISheetOffice'

// AGI Sheet Components (existing)
export { AGIMedUltra } from '@/components/AGISheet/AGIMedUltra'
export { AGIOfficeUltra } from '@/components/AGISheet/AGIOfficeUltra'
export { AGIEcoUltra } from '@/components/AGISheet/AGIEcoUltra'
export { AGIElUltra } from '@/components/AGISheet/AGIElUltra'
export { AGICoreUltra } from '@/components/AGISheet/AGICoreUltra'
export { ProjectManagerUltra } from '@/components/AGISheet/ProjectManagerUltra'

// Security & Monitoring
export { GuardianMonitor } from '@/components/GuardianMonitor'

// UI Components (existing)
export { Input } from '@/components/ui/Input'
export { Modal } from '@/components/ui/Modal'
export { Loading } from '@/components/ui/Loading'
export { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// UTT-Albion Blockchain Integration
// Note: UTT modules are available via @/utt/* paths
// Examples:
// import { getPhantomIntegration } from '@/utt/phantom-integration'
// import { getUTTBridge } from '@/utt/utt-bridge'
// import { ALB_TOKEN } from '@/utt/albion-token'

// Other existing components
export { default as LocationConfigDemo } from '@/components/LocationConfigDemo'

// Settings
export { default as Settings } from '@/components/settings/Settings'

// Default Export - Main App Component
export { Web8TabSystemFixed as default } from '@/components/Web8TabSystem-fixed'
