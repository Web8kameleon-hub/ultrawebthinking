/**
 * Global Data Sources Configuration - Real World APIs & Protocols
 * Zero fake data - all metrics connected to real global sources
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

// 🌍 Geographic & Spatial Data
export const GEOGRAPHIC_SOURCES = {
  openstreetmap: {
    name: 'OpenStreetMap',
    baseUrl: 'https://overpass-api.de/api/interpreter',
    type: 'geographic',
    protocol: 'http',
    description: 'Global maps, roads, urban networks',
    healthCheck: 'https://overpass-api.de/api/status',
    rateLimit: '10000/day',
    auth: 'none'
  },
  copernicus: {
    name: 'Copernicus (ESA)',
    baseUrl: 'https://scihub.copernicus.eu/dhus/odata/v1',
    type: 'satellite',
    protocol: 'http',
    description: 'Satellite data (earth, climate, oceans)',
    healthCheck: 'https://scihub.copernicus.eu/dhus/api/version',
    auth: 'oauth',
    envVar: 'COPERNICUS_API_KEY'
  },
  nasa: {
    name: 'NASA Open Data',
    baseUrl: 'https://api.nasa.gov',
    type: 'space',
    protocol: 'http',
    description: 'Space weather, satellites, astrophysics',
    healthCheck: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
    auth: 'api-key',
    envVar: 'NASA_API_KEY'
  }
}

// 🌡️ Energy & Ecology
export const ENERGY_SOURCES = {
  entsoe: {
    name: 'ENTSO-E Transparency Platform',
    baseUrl: 'https://web-api.tp.entsoe.eu/api',
    type: 'energy',
    protocol: 'http',
    description: 'European energy production/consumption',
    healthCheck: 'https://web-api.tp.entsoe.eu/api?documentType=A44&in_Domain=10YCZ-CEPS-----N&periodStart=202412100000&periodEnd=202412110000',
    auth: 'security-token',
    envVar: 'ENTSO_E_API_KEY',
    regions: ['10YAL-KESH-----5'] // Albania
  },
  openEnergyMonitor: {
    name: 'OpenEnergyMonitor',
    baseUrl: 'https://emoncms.org/api',
    type: 'sensors',
    protocol: 'http',
    description: 'Energy sensors & measurements',
    healthCheck: 'https://emoncms.org/api/input/list.json',
    auth: 'api-key',
    envVar: 'OPEN_ENERGY_API_KEY'
  },
  worldBankClimate: {
    name: 'World Bank Climate Data',
    baseUrl: 'https://climateapi.worldbank.org/climateweb/rest/v1',
    type: 'climate',
    protocol: 'http',
    description: 'CO₂, pollution, environmental indicators',
    healthCheck: 'https://climateapi.worldbank.org/climateweb/rest/v1/country',
    auth: 'none'
  }
}

// ✈️ Aviation & Transport
export const AVIATION_SOURCES = {
  opensky: {
    name: 'OpenSky Network',
    baseUrl: 'https://opensky-network.org/api',
    type: 'aviation',
    protocol: 'http',
    description: 'Real ADS-B data for aircraft in flight',
    healthCheck: 'https://opensky-network.org/api/states/all',
    auth: 'basic',
    envVar: 'OPENSKY_USERNAME',
    rateLimit: '400/day'
  },
  eurocontrol: {
    name: 'EUROCONTROL',
    baseUrl: 'https://www.eurocontrol.int/performance/data/download',
    type: 'aviation',
    protocol: 'http',
    description: 'European air traffic flow standards',
    healthCheck: 'https://www.eurocontrol.int/performance/data/download/xls/Airport_Traffic.xlsx',
    auth: 'none'
  },
  aviationWeather: {
    name: 'Aviation Weather (NOAA)',
    baseUrl: 'https://aviationweather.gov/adds/dataserver_current/httpparam',
    type: 'weather',
    protocol: 'http',
    description: 'METAR/TAF aviation weather data',
    healthCheck: 'https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=LYTV&hoursBeforeNow=1',
    auth: 'none'
  }
}

// 💹 Economy & Finance
export const FINANCE_SOURCES = {
  ecb: {
    name: 'European Central Bank',
    baseUrl: 'https://sdw-wsrest.ecb.europa.eu/service',
    type: 'economics',
    protocol: 'http',
    description: 'Interest rates, FX, inflation',
    healthCheck: 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A',
    auth: 'none'
  },
  worldBank: {
    name: 'World Bank Open Data',
    baseUrl: 'https://api.worldbank.org/v2',
    type: 'economics',
    protocol: 'http',
    description: 'Global economic indicators',
    healthCheck: 'https://api.worldbank.org/v2/country/ALB/indicator/NY.GDP.MKTP.CD?format=json',
    auth: 'none'
  },
  coingecko: {
    name: 'CoinGecko',
    baseUrl: 'https://api.coingecko.com/api/v3',
    type: 'crypto',
    protocol: 'http',
    description: 'Crypto prices, real-time markets',
    healthCheck: 'https://api.coingecko.com/api/v3/ping',
    auth: 'api-key',
    envVar: 'COINGECKO_API_KEY'
  },
  solana: {
    name: 'Solana RPC',
    baseUrl: 'https://api.mainnet-beta.solana.com',
    type: 'blockchain',
    protocol: 'json-rpc',
    description: 'Solana blockchain data',
    healthCheck: '{"jsonrpc":"2.0","id":1,"method":"getHealth"}',
    auth: 'none'
  }
}

// 🧠 Health & Medicine
export const HEALTH_SOURCES = {
  who: {
    name: 'WHO Data Hub',
    baseUrl: 'https://ghoapi.azureedge.net/api',
    type: 'health',
    protocol: 'http',
    description: 'Global health, pandemic statistics',
    healthCheck: 'https://ghoapi.azureedge.net/api/Dimension',
    auth: 'none'
  },
  pubmed: {
    name: 'PubMed API (NIH)',
    baseUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
    type: 'research',
    protocol: 'http',
    description: 'Medical research publications',
    healthCheck: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi',
    auth: 'api-key',
    envVar: 'NCBI_API_KEY'
  },
  fhir: {
    name: 'FHIR Standard (HL7)',
    baseUrl: process.env.FHIR_BASE || 'https://hapi.fhir.org/baseR4',
    type: 'medical',
    protocol: 'fhir',
    description: 'Hospital & medical device integration',
    healthCheck: '/metadata',
    auth: 'oauth',
    envVar: 'FHIR_BASE'
  }
}

// 📊 Science & Knowledge
export const SCIENCE_SOURCES = {
  wikidata: {
    name: 'Wikidata',
    baseUrl: 'https://www.wikidata.org/w/api.php',
    type: 'knowledge',
    protocol: 'http',
    description: 'Open knowledge base (linked data)',
    healthCheck: 'https://www.wikidata.org/w/api.php?action=query&meta=siteinfo&format=json',
    auth: 'none'
  },
  openAlex: {
    name: 'OpenAlex',
    baseUrl: 'https://api.openalex.org',
    type: 'academic',
    protocol: 'http',
    description: 'Global academic publications',
    healthCheck: 'https://api.openalex.org/works?filter=publication_year:2024&per_page=1',
    auth: 'none'
  },
  arxiv: {
    name: 'arXiv API',
    baseUrl: 'http://export.arxiv.org/api',
    type: 'research',
    protocol: 'http',
    description: 'Scientific research (physics, AI, math)',
    healthCheck: 'http://export.arxiv.org/api/query?search_query=cat:cs.AI&max_results=1',
    auth: 'none'
  }
}

// 📶 Network & IoT
export const IOT_SOURCES = {
  lora: {
    name: 'LoRa Alliance Specs',
    baseUrl: process.env.LORA_BASE_URL || 'https://lora-gateway.local',
    type: 'iot',
    protocol: 'lorawan',
    description: 'LoRaWAN communication standards',
    healthCheck: '/status',
    auth: 'api-key',
    envVar: 'LORA_BASE_URL'
  },
  mqtt: {
    name: 'MQTT Broker',
    baseUrl: process.env.MQTT_URL || 'mqtt://localhost:1883',
    type: 'messaging',
    protocol: 'mqtt',
    description: 'IoT messaging',
    healthCheck: '/health',
    auth: 'username-password',
    envVar: 'MQTT_URL'
  },
  prometheus: {
    name: 'Prometheus Metrics',
    baseUrl: process.env.PROMETHEUS_URL || 'http://localhost:9090',
    type: 'monitoring',
    protocol: 'http',
    description: 'Industrial observability & monitoring',
    healthCheck: '/api/v1/query?query=up',
    auth: 'none',
    envVar: 'PROMETHEUS_URL'
  }
}

// 🔒 Security & Decentralization
export const DECENTRALIZED_SOURCES = {
  ipfs: {
    name: 'IPFS Gateway',
    baseUrl: process.env.IPFS_GATEWAY || 'https://ipfs.io',
    type: 'storage',
    protocol: 'ipfs',
    description: 'Distributed storage',
    healthCheck: '/api/v0/version',
    auth: 'none',
    envVar: 'IPFS_GATEWAY'
  },
  matrix: {
    name: 'Matrix Protocol',
    baseUrl: process.env.MATRIX_HOMESERVER || 'https://matrix.org',
    type: 'communication',
    protocol: 'matrix',
    description: 'Decentralized communication',
    healthCheck: '/_matrix/federation/v1/version',
    auth: 'access-token',
    envVar: 'MATRIX_HOMESERVER'
  }
}

// 🌟 All Sources Registry
export const ALL_GLOBAL_SOURCES = {
  ...GEOGRAPHIC_SOURCES,
  ...ENERGY_SOURCES,
  ...AVIATION_SOURCES,
  ...FINANCE_SOURCES,
  ...HEALTH_SOURCES,
  ...SCIENCE_SOURCES,
  ...IOT_SOURCES,
  ...DECENTRALIZED_SOURCES
}

// 🏷️ Source Categories
export const SOURCE_CATEGORIES = {
  geographic: Object.keys(GEOGRAPHIC_SOURCES),
  energy: Object.keys(ENERGY_SOURCES),
  aviation: Object.keys(AVIATION_SOURCES),
  finance: Object.keys(FINANCE_SOURCES),
  health: Object.keys(HEALTH_SOURCES),
  science: Object.keys(SCIENCE_SOURCES),
  iot: Object.keys(IOT_SOURCES),
  decentralized: Object.keys(DECENTRALIZED_SOURCES)
}

// 🔧 Utility Functions
export function getSourcesByCategory(category: keyof typeof SOURCE_CATEGORIES) {
  return SOURCE_CATEGORIES[category].map(key => ({
    key,
    ...ALL_GLOBAL_SOURCES[key as keyof typeof ALL_GLOBAL_SOURCES]
  }))
}

export function getSourceByKey(key: keyof typeof ALL_GLOBAL_SOURCES) {
  return ALL_GLOBAL_SOURCES[key]
}

export function getAllEnabledSources() {
  return Object.entries(ALL_GLOBAL_SOURCES).filter(([, source]) => {
    // Check if required environment variables are set
    if ('envVar' in source && source.envVar && !process.env[source.envVar]) {
      return false
    }
    return true
  })
}

export function getSourceHealthCheckUrl(key: keyof typeof ALL_GLOBAL_SOURCES) {
  const source = ALL_GLOBAL_SOURCES[key]
  if (!source) return null
  
  if (source.healthCheck.startsWith('http')) {
    return source.healthCheck
  } else {
    return source.baseUrl + source.healthCheck
  }
}
