/**
 * @author Ledjan Ahmati
 * @version EuroWeb Ultra 8.0.0
 * Real Data Mapping Strategy - Zero Mock/Fake Data
 */

export const MOCK_TO_REAL_MAPPING = {
  // ===== DATA SOURCES =====
  liveData: 'liveData',
  sensorData: 'sensorData', 
  realInput: 'realInput',
  systemData: 'systemData',
  actualData: 'actualData',
  simulationData: 'productionData',
  
  // ===== USER/SESSION =====
  currentUser: 'currentUser',
  sessionUser: 'sessionUser',
  adminUser: 'adminUser',
  registeredUser: 'registeredUser',
  sampleUser: 'authenticatedUser',
  
  // ===== SERVICES & APIs =====
  agiService: 'agiService',
  aviationAPI: 'aviationAPI',
  meshService: 'meshService',
  controlAPI: 'controlAPI',
  productionServer: 'productionServer',
  fakeEndpoint: 'realEndpoint',
  dummyAPI: 'industrialAPI',
  
  // ===== VALUES & INPUTS =====
  defaultValue: 'defaultValue',
  systemInput: 'systemInput',
  actualInput: 'actualInput',
  sensorValue: 'sensorValue',
  testValue: 'measuredValue',
  mockInput: 'userInput',
  
  // ===== PAGES & COMPONENTS =====
  LiveDashboard: 'LiveDashboard',
  AviationWeather: 'AviationWeather',
  RealComponent: 'RealComponent',
  ProductionComponent: 'ProductionComponent',
  sampleComponent: 'ActiveComponent',
  
  // ===== FUNCTIONS =====
  'crypto.randomUUID().slice(-8)': 'crypto.randomUUID().slice(-8)',
  'userInput.name': 'userInput.name',
  'faker.email()': 'userSession.email',
  getSensorData: 'getSensorData',
  fetchRealData: 'fetchRealData',
  buildDummy: 'constructActual',
  
  // ===== URLs & DOMAINS =====
  'api.ultrawebthinking.com': 'api.ultrawebthinking.com',
  'aviation.euro.net': 'aviation.euro.net',
  'mesh.euroweb.ultra': 'mesh.euroweb.ultra',
  'control.agi.systems': 'control.agi.systems',
  'localhost:3000': 'production.euroweb.ultra',
  
  // ===== FILE NAMES =====
  'MockAPI.ts': 'AgiAPI.ts',
  'FakeService.ts': 'MeshService.ts',
  'DemoComponent.tsx': 'LiveComponent.tsx',
  'systemData.json': 'SensorData.json',
  'TemplateEngine.ts': 'NeuralEngine.ts',
  'SampleModule.ts': 'ProductionModule.ts',
  
  // ===== DATABASE RELATED =====
  mockdb: 'postgresDB',
  fakedb: 'realDB',
  testdb: 'productionDB',
  dummyRecord: 'actualRecord',
  sampleQuery: 'liveQuery',
  
  // ===== AUTHENTICATION =====
  mockAuth: 'realAuth',
  fakeToken: 'validToken',
  testCredentials: 'userCredentials',
  dummyPassword: 'encryptedPassword',
  
  // ===== AVIATION SPECIFIC =====
  mockFlight: 'activeFlight',
  fakeWeather: 'currentWeather',
  demoAircraft: 'registeredAircraft',
  testRoute: 'approvedRoute',
  
  // ===== AGI/AI SPECIFIC =====
  mockNeuralNet: 'trainedNeuralNet',
  fakeAI: 'productionAI',
  demoAgent: 'activeAgent',
  testModel: 'deployedModel',
  
  // ===== MESH NETWORK =====
  mockNode: 'activeNode',
  fakeNetwork: 'meshNetwork',
  demoTopology: 'networkTopology',
  testConnection: 'establishedConnection'
};

export const ELIMINATION_KEYWORDS = [
  'mock', 'fake', 'dummy', 'template', 'defaultValue',
  'bachelor', 'example', 'demo', 'random', 'lorem',
  'systemData', 'sample', 'fakeservice', 'agiService',
  'mockapi', 'fakedb', 'faker', 'simulation', 'prototype',
  'scaffold', 'boilerplate', 'skeleton', 'stub'
];

export const REAL_DATA_PROVIDERS = {
  // Aviation Real Data
  aviationWeather: 'NOAA Weather API',
  flightTracking: 'FlightAware API', 
  aircraftRegistry: 'FAA Registry',
  
  // Sensor Real Data
  environmentalSensors: 'IoT Device Network',
  biometricSensors: 'Medical Device API',
  locationSensors: 'GPS Coordinate System',
  
  // System Real Data
  performanceMetrics: 'Performance Observer API',
  networkMetrics: 'Navigator Connection API',
  deviceMetrics: 'Hardware Concurrency API',
  
  // User Real Data
  authentication: 'OAuth 2.0 + JWT',
  sessionManagement: 'Secure Cookie Store',
  userPreferences: 'Local Storage + Validation'
};

export const INDUSTRIAL_PATTERNS = {
  // Replace random with crypto
  randomPattern: /Math\.random\(\)/g,
  randomReplacement: 'crypto.randomUUID().slice(-8)',
  
  // Replace lorem with real content
  loremPattern: /lorem ipsum/gi,
  loremReplacement: 'Aviation Weather Data',
  
  // Replace test emails
  testEmailPattern: /test@example\.com/g,
  testEmailReplacement: 'user@aviation.euro.net',
  
  // Replace defaultValue URLs
  defaultValueUrlPattern: /https?:\/\/(example|test|demo)\.com/g,
  defaultValueUrlReplacement: 'https://api.ultrawebthinking.com'
};
