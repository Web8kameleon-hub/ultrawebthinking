'use client';

import { useState, useEffect } from 'react';
import styles from './albion.module.css';

interface AlbionTool {
  id: string;
  name: string;
  nameAlbanian: string;
  category: 'komunikim' | 'siguri' | 'analiza' | 'automatizim' | 'infrastrukture' | 'kulturore';
  description: string;
  descriptionAlbanian: string;
  status: 'aktiv' | 'joaktiv' | 'ne-proces' | 'gabim';
  lastUsed: string;
  usage: number;
  performance: number;
  priority: 'larte' | 'mesatare' | 'ulet';
  location: string;
  features: string[];
  featuresAlbanian: string[];
  icon: string;
}

interface AlbionMetrics {
  totalTools: number;
  activeTools: number;
  systemLoad: number;
  albaniaSystems: number;
  kosovoSystems: number;
  diasporaSystems: number;
  totalUsage: number;
  averagePerformance: number;
  criticalAlerts: number;
}

interface AlbionSystemStatus {
  region: string;
  systems: number;
  activeSystems: number;
  load: number;
  status: 'operacional' | 'degraduar' | 'kritik';
  lastUpdate: string;
}

export default function AlbionUTTDashboard() {
  const [tools, setTools] = useState<AlbionTool[]>([]);
  const [metrics, setMetrics] = useState<AlbionMetrics>({
    totalTools: 0,
    activeTools: 0,
    systemLoad: 0,
    albaniaSystems: 0,
    kosovoSystems: 0,
    diasporaSystems: 0,
    totalUsage: 0,
    averagePerformance: 0,
    criticalAlerts: 0
  });
  const [regionalStatus, setRegionalStatus] = useState<AlbionSystemStatus[]>([]);
  const [selectedTool, setSelectedTool] = useState<AlbionTool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('te-gjitha');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'sq' | 'en'>('sq');

  useEffect(() => {
    fetchAlbionData();
    const interval = setInterval(fetchAlbionData, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlbionData = async () => {
    setIsLoading(true);
    try {
      // Simulate Albion UTT data
      const mockTools: AlbionTool[] = [
        {
          id: 'kom-001',
          name: 'Albanian Network Monitor',
          nameAlbanian: 'Monitoruesi i Rrjetit Shqiptar',
          category: 'komunikim',
          description: 'Advanced network monitoring for Albanian infrastructure',
          descriptionAlbanian: 'Monitorim i avancuar i rrjetit për infrastrukturën shqiptare',
          status: 'aktiv',
          lastUsed: new Date().toISOString(),
          usage: 89,
          performance: 94,
          priority: 'larte',
          location: 'Tiranë, Shqipëri',
          features: ['Network Topology', 'Traffic Analysis', 'Performance Monitoring', 'Alert System'],
          featuresAlbanian: ['Topologjia e Rrjetit', 'Analiza e Trafikut', 'Monitorim Performance', 'Sistemi i Alarmeve'],
          icon: '🌐'
        },
        {
          id: 'sig-001',
          name: 'Albion Security Scanner',
          nameAlbanian: 'Skaneri i Sigurisë Albion',
          category: 'siguri',
          description: 'Comprehensive security scanning for Albanian systems',
          descriptionAlbanian: 'Skanim i plotë i sigurisë për sistemet shqiptare',
          status: 'aktiv',
          lastUsed: new Date(Date.now() - 120000).toISOString(),
          usage: 76,
          performance: 91,
          priority: 'larte',
          location: 'Prishtinë, Kosovë',
          features: ['Vulnerability Assessment', 'Threat Detection', 'Compliance Check', 'Risk Analysis'],
          featuresAlbanian: ['Vlerësim i Dobësive', 'Zbulim Kërcënimesh', 'Kontroll Konformiteti', 'Analiza e Rreziqeve'],
          icon: '🛡️'
        },
        {
          id: 'ana-001',
          name: 'Albanian Data Analyzer',
          nameAlbanian: 'Analizuesi i të Dhënave Shqiptare',
          category: 'analiza',
          description: 'Advanced data analysis for Albanian language content',
          descriptionAlbanian: 'Analizë e avancuar e të dhënave për përmbajtjen në gjuhën shqipe',
          status: 'ne-proces',
          lastUsed: new Date(Date.now() - 60000).toISOString(),
          usage: 68,
          performance: 88,
          priority: 'mesatare',
          location: 'Shkup, Maqedonia e Veriut',
          features: ['Text Analysis', 'Language Processing', 'Sentiment Analysis', 'Entity Recognition'],
          featuresAlbanian: ['Analiza e Tekstit', 'Procesim Gjuhësor', 'Analiza e Ndjenjave', 'Njohja e Entiteteve'],
          icon: '📊'
        },
        {
          id: 'aut-001',
          name: 'Kosova Automation Engine',
          nameAlbanian: 'Motori i Automatizimit të Kosovës',
          category: 'automatizim',
          description: 'Intelligent automation for Kosovo systems',
          descriptionAlbanian: 'Automatizim inteligjent për sistemet e Kosovës',
          status: 'aktiv',
          lastUsed: new Date(Date.now() - 90000).toISOString(),
          usage: 82,
          performance: 89,
          priority: 'larte',
          location: 'Prizren, Kosovë',
          features: ['Workflow Automation', 'Task Scheduling', 'Process Optimization', 'Event Handling'],
          featuresAlbanian: ['Automatizim i Proceseve', 'Planifikim Detyrash', 'Optimizim Procesesh', 'Menaxhim Ngjarjesh'],
          icon: '⚙️'
        },
        {
          id: 'inf-001',
          name: 'Albanian Infrastructure Monitor',
          nameAlbanian: 'Monitoruesi i Infrastrukturës Shqiptare',
          category: 'infrastrukture',
          description: 'Critical infrastructure monitoring across Albanian regions',
          descriptionAlbanian: 'Monitorim i infrastrukturës kritike nëpër rajonet shqiptare',
          status: 'aktiv',
          lastUsed: new Date(Date.now() - 45000).toISOString(),
          usage: 91,
          performance: 96,
          priority: 'larte',
          location: 'Durrës, Shqipëri',
          features: ['System Health', 'Resource Monitoring', 'Capacity Planning', 'Disaster Recovery'],
          featuresAlbanian: ['Shëndeti i Sistemit', 'Monitorim Burimesh', 'Planifikim Kapacitetesh', 'Rikuperim nga Fatkeqësitë'],
          icon: '🏗️'
        },
        {
          id: 'kul-001',
          name: 'Albanian Heritage Digitizer',
          nameAlbanian: 'Dixhitalizuesi i Trashëgimisë Shqiptare',
          category: 'kulturore',
          description: 'Digital preservation of Albanian cultural heritage',
          descriptionAlbanian: 'Ruajtje dixhitale e trashëgimisë kulturore shqiptare',
          status: 'aktiv',
          lastUsed: new Date(Date.now() - 180000).toISOString(),
          usage: 45,
          performance: 85,
          priority: 'mesatare',
          location: 'Gjirokastër, Shqipëri',
          features: ['Document Scanning', 'Audio Digitization', 'Video Processing', 'Metadata Generation'],
          featuresAlbanian: ['Skanim Dokumentesh', 'Dixhitalizim Audio', 'Procesim Video', 'Gjenerim Metadatash'],
          icon: '🏛️'
        },
        {
          id: 'dia-001',
          name: 'Diaspora Connect System',
          nameAlbanian: 'Sistemi i Lidhjeve me Diasporën',
          category: 'komunikim',
          description: 'Communication system connecting Albanian diaspora worldwide',
          descriptionAlbanian: 'Sistem komunikimi që lidh diasporën shqiptare në mbarë botën',
          status: 'aktiv',
          lastUsed: new Date(Date.now() - 30000).toISOString(),
          usage: 73,
          performance: 87,
          priority: 'larte',
          location: 'New York, SHBA',
          features: ['Global Messaging', 'Video Conferencing', 'File Sharing', 'Community Forums'],
          featuresAlbanian: ['Mesazhe Globale', 'Video Konferenca', 'Ndarje Skedarësh', 'Forume Komunitare'],
          icon: '🌍'
        },
        {
          id: 'edu-001',
          name: 'Albanian Education Platform',
          nameAlbanian: 'Platforma Arsimore Shqiptare',
          category: 'kulturore',
          description: 'Digital education platform for Albanian language learning',
          descriptionAlbanian: 'Platformë arsimore dixhitale për mësimin e gjuhës shqipe',
          status: 'joaktiv',
          lastUsed: new Date(Date.now() - 600000).toISOString(),
          usage: 25,
          performance: 65,
          priority: 'ulet',
          location: 'Vlorë, Shqipëri',
          features: ['Online Courses', 'Interactive Lessons', 'Progress Tracking', 'Certificate Generation'],
          featuresAlbanian: ['Kurse Online', 'Mësime Interaktive', 'Ndjekje Progresi', 'Gjenerim Certifikatash'],
          icon: '📚'
        }
      ];

      // Calculate regional status
      const albania = mockTools.filter(t => t.location.includes('Shqipëri'));
      const kosovo = mockTools.filter(t => t.location.includes('Kosov'));
      const diaspora = mockTools.filter(t => !t.location.includes('Shqipëri') && !t.location.includes('Kosov'));

      const mockRegionalStatus: AlbionSystemStatus[] = [
        {
          region: 'Shqipëria',
          systems: albania.length,
          activeSystems: albania.filter(t => t.status === 'aktiv').length,
          load: Math.floor(Math.random() * 30) + 60,
          status: 'operacional',
          lastUpdate: new Date().toISOString()
        },
        {
          region: 'Kosova',
          systems: kosovo.length,
          activeSystems: kosovo.filter(t => t.status === 'aktiv').length,
          load: Math.floor(Math.random() * 25) + 55,
          status: 'operacional',
          lastUpdate: new Date().toISOString()
        },
        {
          region: 'Diaspora',
          systems: diaspora.length,
          activeSystems: diaspora.filter(t => t.status === 'aktiv').length,
          load: Math.floor(Math.random() * 40) + 40,
          status: 'operacional',
          lastUpdate: new Date().toISOString()
        }
      ];

      // Calculate metrics
      const activeTools = mockTools.filter(t => t.status === 'aktiv' || t.status === 'ne-proces').length;
      const totalUsage = mockTools.reduce((sum, t) => sum + t.usage, 0);
      const avgPerformance = mockTools.reduce((sum, t) => sum + t.performance, 0) / mockTools.length;
      const criticalAlerts = mockTools.filter(t => t.status === 'gabim' || t.priority === 'larte').length;

      const mockMetrics: AlbionMetrics = {
        totalTools: mockTools.length,
        activeTools,
        systemLoad: Math.max(...mockRegionalStatus.map(r => r.load)),
        albaniaSystems: albania.length,
        kosovoSystems: kosovo.length,
        diasporaSystems: diaspora.length,
        totalUsage: Math.round(totalUsage / mockTools.length),
        averagePerformance: Math.round(avgPerformance),
        criticalAlerts
      };

      setTools(mockTools);
      setMetrics(mockMetrics);
      setRegionalStatus(mockRegionalStatus);
    } catch (error) {
      console.error('Error fetching Albion data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktiv': return '#00ff88';
      case 'ne-proces': return '#00d4ff';
      case 'joaktiv': return '#6c757d';
      case 'gabim': return '#ff6b6b';
      default: return '#ffa502';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'larte': return '#ff6b6b';
      case 'mesatare': return '#ffa502';
      case 'ulet': return '#00ff88';
      default: return '#6c757d';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'komunikim': return '#00d4ff';
      case 'siguri': return '#ff6b6b';
      case 'analiza': return '#ffa502';
      case 'automatizim': return '#9b59b6';
      case 'infrastrukture': return '#00ff88';
      case 'kulturore': return '#f39c12';
      default: return '#6c757d';
    }
  };

  const getPerformanceClass = (performance: number) => {
    if (performance >= 90) return 'excellent';
    if (performance >= 80) return 'good';
    if (performance >= 70) return 'fair';
    return 'poor';
  };

  const formatLastUsed = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return language === 'sq' ? 'Tani' : 'Just now';
    if (diffMins < 60) return `${diffMins}min ${language === 'sq' ? 'më parë' : 'ago'}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ${language === 'sq' ? 'më parë' : 'ago'}`;
    return date.toLocaleDateString();
  };

  const filteredTools = selectedCategory === 'te-gjitha' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const t = (key: string) => {
    const translations: { [key: string]: { sq: string; en: string } } = {
      title: { sq: '🇦🇱 Albion UTT - Mjetet Teknike Shqiptare', en: '🇦🇱 Albion UTT - Albanian Technical Tools' },
      subtitle: { sq: 'Mjete të avancuara teknike për sistemet dhe infrastrukturën shqiptare', en: 'Advanced technical tools for Albanian systems and infrastructure' },
      lastUpdated: { sq: 'Përditësimi i fundit:', en: 'Last updated:' },
      totalTools: { sq: 'Mjete Gjithsej', en: 'Total Tools' },
      activeTools: { sq: 'Mjete Aktive', en: 'Active Tools' },
      systemLoad: { sq: 'Ngarkesa Sistemi', en: 'System Load' },
      albania: { sq: 'Shqipëria', en: 'Albania' },
      kosovo: { sq: 'Kosova', en: 'Kosovo' },
      diaspora: { sq: 'Diaspora', en: 'Diaspora' },
      performance: { sq: 'Performance', en: 'Performance' },
      criticalAlerts: { sq: 'Alarme Kritike', en: 'Critical Alerts' },
      refreshing: { sq: '⟳ Duke u Përditësuar...', en: '⟳ Refreshing...' },
      refresh: { sq: '🔄 Përditëso Sistemin', en: '🔄 Refresh System' }
    };
    return translations[key]?.[language] || key;
  };

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <div className={styles['language-toggle']}>
          <button 
            className={`${styles['lang-btn']} ${language === 'sq' ? styles['active'] : ''}`}
            onClick={() => setLanguage('sq')}
          >
            🇦🇱 SQ
          </button>
          <button 
            className={`${styles['lang-btn']} ${language === 'en' ? styles['active'] : ''}`}
            onClick={() => setLanguage('en')}
          >
            🇺🇸 EN
          </button>
        </div>
        
        <h1 className={styles['title']}>{t('title')}</h1>
        <p className={styles['subtitle']}>
          {t('subtitle')}
        </p>
        <div className={styles['last-updated']}>
          {t('lastUpdated')} {new Date().toLocaleTimeString()}
          {isLoading && <span className={styles['loading']}>⟳</span>}
        </div>
      </div>

      {/* Regional Status Overview */}
      <div className={styles['regional-section']}>
        <h2 className={styles['section-title']}>
          {language === 'sq' ? '🗺️ Statusi Rajonal' : '🗺️ Regional Status'}
        </h2>
        <div className={styles['regional-grid']}>
          {regionalStatus.map((region) => (
            <div key={region.region} className={styles['regional-card']}>
              <div className={styles['regional-header']}>
                <div className={styles['regional-name']}>{region.region}</div>
                <div className={`${styles['regional-status']} ${styles[region.status]}`}>
                  {region.status.toUpperCase()}
                </div>
              </div>
              <div className={styles['regional-metrics']}>
                <div className={styles['regional-metric']}>
                  <span>{language === 'sq' ? 'Sisteme:' : 'Systems:'}</span>
                  <span>{region.activeSystems}/{region.systems}</span>
                </div>
                <div className={styles['regional-metric']}>
                  <span>{language === 'sq' ? 'Ngarkesa:' : 'Load:'}</span>
                  <span>{region.load}%</span>
                </div>
              </div>
              <div className={styles['regional-bar']}>
                <div 
                  className={styles['regional-bar-fill']}
                  style={{ width: `${region.load}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Overview */}
      <div className={styles['metrics-grid']}>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>🛠️</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.totalTools}</div>
            <div className={styles['metric-label']}>{t('totalTools')}</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>⚡</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.activeTools}</div>
            <div className={styles['metric-label']}>{t('activeTools')}</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>📊</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.systemLoad}%</div>
            <div className={styles['metric-label']}>{t('systemLoad')}</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>🇦🇱</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.albaniaSystems}</div>
            <div className={styles['metric-label']}>{t('albania')}</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>🇽🇰</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.kosovoSystems}</div>
            <div className={styles['metric-label']}>{t('kosovo')}</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>🌍</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.diasporaSystems}</div>
            <div className={styles['metric-label']}>{t('diaspora')}</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>🎯</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.averagePerformance}%</div>
            <div className={styles['metric-label']}>{t('performance')}</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>🚨</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.criticalAlerts}</div>
            <div className={styles['metric-label']}>{t('criticalAlerts')}</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles['filter-section']}>
        <h2 className={styles['section-title']}>
          {language === 'sq' ? '🗂️ Kategoritë e Mjeteve' : '🗂️ Tool Categories'}
        </h2>
        <div className={styles['category-filters']}>
          <button 
            className={`${styles['category-button']} ${selectedCategory === 'te-gjitha' ? styles['active'] : ''}`}
            onClick={() => setSelectedCategory('te-gjitha')}
          >
            🌐 {language === 'sq' ? 'Të Gjitha' : 'All'} ({tools.length})
          </button>
          <button 
            className={`${styles['category-button']} ${selectedCategory === 'komunikim' ? styles['active'] : ''}`}
            onClick={() => setSelectedCategory('komunikim')}
          >
            📡 {language === 'sq' ? 'Komunikim' : 'Communication'} ({tools.filter(t => t.category === 'komunikim').length})
          </button>
          <button 
            className={`${styles['category-button']} ${selectedCategory === 'siguri' ? styles['active'] : ''}`}
            onClick={() => setSelectedCategory('siguri')}
          >
            🛡️ {language === 'sq' ? 'Siguri' : 'Security'} ({tools.filter(t => t.category === 'siguri').length})
          </button>
          <button 
            className={`${styles['category-button']} ${selectedCategory === 'analiza' ? styles['active'] : ''}`}
            onClick={() => setSelectedCategory('analiza')}
          >
            📊 {language === 'sq' ? 'Analizë' : 'Analysis'} ({tools.filter(t => t.category === 'analiza').length})
          </button>
          <button 
            className={`${styles['category-button']} ${selectedCategory === 'automatizim' ? styles['active'] : ''}`}
            onClick={() => setSelectedCategory('automatizim')}
          >
            ⚙️ {language === 'sq' ? 'Automatizim' : 'Automation'} ({tools.filter(t => t.category === 'automatizim').length})
          </button>
          <button 
            className={`${styles['category-button']} ${selectedCategory === 'infrastrukture' ? styles['active'] : ''}`}
            onClick={() => setSelectedCategory('infrastrukture')}
          >
            🏗️ {language === 'sq' ? 'Infrastrukturë' : 'Infrastructure'} ({tools.filter(t => t.category === 'infrastrukture').length})
          </button>
          <button 
            className={`${styles['category-button']} ${selectedCategory === 'kulturore' ? styles['active'] : ''}`}
            onClick={() => setSelectedCategory('kulturore')}
          >
            🏛️ {language === 'sq' ? 'Kulturore' : 'Cultural'} ({tools.filter(t => t.category === 'kulturore').length})
          </button>
        </div>
      </div>

      {/* Tools Grid */}
      <div className={styles['tools-section']}>
        <h2 className={styles['section-title']}>
          🔧 {language === 'sq' ? 'Mjetet e Disponueshme' : 'Available Tools'} ({filteredTools.length})
        </h2>
        <div className={styles['tools-grid']}>
          {filteredTools.map((tool) => (
            <div 
              key={tool.id} 
              className={styles['tool-card']}
              onClick={() => setSelectedTool(tool)}
            >
              <div className={styles['tool-header']}>
                <div className={styles['tool-icon-title']}>
                  <span className={styles['tool-icon']}>{tool.icon}</span>
                  <div className={styles['tool-title']}>
                    {language === 'sq' ? tool.nameAlbanian : tool.name}
                  </div>
                </div>
                <div 
                  className={styles['tool-status']}
                  style={{ color: getStatusColor(tool.status) }}
                >
                  ● {tool.status.toUpperCase()}
                </div>
              </div>
              
              <div 
                className={styles['tool-category']} 
                style={{ color: getCategoryColor(tool.category) }}
              >
                {tool.category.toUpperCase()}
              </div>
              
              <div className={styles['tool-description']}>
                {language === 'sq' ? tool.descriptionAlbanian : tool.description}
              </div>

              <div className={styles['tool-location']}>
                📍 {tool.location}
              </div>
              
              <div className={styles['tool-metrics']}>
                <div className={styles['tool-metric']}>
                  <span>{language === 'sq' ? 'Përdorimi:' : 'Usage:'}</span>
                  <div className={styles['usage-bar']}>
                    <div 
                      className={styles['usage-fill']}
                      style={{ width: `${tool.usage}%` }}
                    />
                    <span className={styles['usage-text']}>{tool.usage}%</span>
                  </div>
                </div>
                <div className={styles['tool-metric']}>
                  <span>Performance:</span>
                  <span className={`${styles['performance-value']} ${styles[getPerformanceClass(tool.performance)]}`}>
                    {tool.performance}%
                  </span>
                </div>
                <div className={styles['tool-metric']}>
                  <span>{language === 'sq' ? 'Prioriteti:' : 'Priority:'}</span>
                  <span 
                    className={styles['priority-value']}
                    style={{ color: getPriorityColor(tool.priority) }}
                  >
                    {tool.priority.toUpperCase()}
                  </span>
                </div>
                <div className={styles['tool-metric']}>
                  <span>{language === 'sq' ? 'Përdorur:' : 'Last Used:'}</span>
                  <span>{formatLastUsed(tool.lastUsed)}</span>
                </div>
              </div>
              
              <div className={styles['tool-features']}>
                <div className={styles['features-label']}>
                  {language === 'sq' ? 'Veçoritë:' : 'Features:'}
                </div>
                <div className={styles['features-count']}>
                  {tool.features.length} {language === 'sq' ? 'të disponueshme' : 'available'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Details Modal */}
      {selectedTool && (
        <div className={styles['modal-overlay']} onClick={() => setSelectedTool(null)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3 className={styles['modal-title']}>
                {selectedTool.icon} {language === 'sq' ? selectedTool.nameAlbanian : selectedTool.name}
              </h3>
              <button 
                className={styles['modal-close']}
                onClick={() => setSelectedTool(null)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles['modal-body']}>
              <div className={styles['tool-details']}>
                <div className={styles['detail-section']}>
                  <h4>{language === 'sq' ? 'Informacioni i Mjetit' : 'Tool Information'}</h4>
                  <div className={styles['detail-item']}>
                    <span>{language === 'sq' ? 'Kategoria:' : 'Category:'}</span>
                    <span style={{ color: getCategoryColor(selectedTool.category) }}>
                      {selectedTool.category.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>{language === 'sq' ? 'Statusi:' : 'Status:'}</span>
                    <span style={{ color: getStatusColor(selectedTool.status) }}>
                      {selectedTool.status.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>{language === 'sq' ? 'Prioriteti:' : 'Priority:'}</span>
                    <span style={{ color: getPriorityColor(selectedTool.priority) }}>
                      {selectedTool.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>{language === 'sq' ? 'Lokacioni:' : 'Location:'}</span>
                    <span>📍 {selectedTool.location}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>{language === 'sq' ? 'Përshkrimi:' : 'Description:'}</span>
                    <span>{language === 'sq' ? selectedTool.descriptionAlbanian : selectedTool.description}</span>
                  </div>
                </div>
                
                <div className={styles['detail-section']}>
                  <h4>{language === 'sq' ? 'Metrikat e Performance' : 'Performance Metrics'}</h4>
                  <div className={styles['detail-item']}>
                    <span>{language === 'sq' ? 'Përdorimi:' : 'Usage:'}</span>
                    <span>{selectedTool.usage}%</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>Performance:</span>
                    <span className={styles[getPerformanceClass(selectedTool.performance)]}>
                      {selectedTool.performance}%
                    </span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>{language === 'sq' ? 'Përdorur për herë të fundit:' : 'Last Used:'}</span>
                    <span>{new Date(selectedTool.lastUsed).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className={styles['detail-section']}>
                  <h4>{language === 'sq' ? 'Veçoritë e Disponueshme' : 'Available Features'}</h4>
                  <div className={styles['features-list']}>
                    {(language === 'sq' ? selectedTool.featuresAlbanian : selectedTool.features).map((feature, index) => (
                      <div key={index} className={styles['feature-item']}>
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles['controls']}>
        <button 
          className={styles['refresh-button']}
          onClick={fetchAlbionData}
          disabled={isLoading}
        >
          {isLoading ? t('refreshing') : t('refresh')}
        </button>
      </div>
    </div>
  );
}
