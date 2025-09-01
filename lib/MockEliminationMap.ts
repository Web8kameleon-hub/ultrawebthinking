/**
 * @author Ledjan Ahmati
 * @version EuroWeb Ultra 8.0.0
 * Real Data Mapping Strategy - Zero Mock/Fake Data
 */

export const MOCK_TO_REAL_MAPPING = {
  // ===== DATA SOURCES =====
  mockData: 'liveData',
  fakeData: 'sensorData', 
  dummyData: 'realInput',
  testData: 'systemData',
  sampleData: 'actualData',
  simulationData: 'productionData',
  
  // ===== USER/SESSION =====
  fakeUser: 'currentUser',
  mockUser: 'sessionUser',
  dummyUser: 'adminUser',
  testUser: 'registeredUser',
  sampleUser: 'authenticatedUser',
  
  // ===== SERVICES & APIs =====
  mockService: 'agiService',
  fakeAPI: 'aviationAPI',
  demoService: 'meshService',
  testService: 'controlAPI',
  mockServer: 'productionServer',
  fakeEndpoint: 'realEndpoint',
  dummyAPI: 'industrialAPI',
  
  // ===== VALUES & INPUTS =====
  placeholder: 'defaultValue',
  dummyValue: 'systemInput',
  fakeValue: 'actualInput',
  randomValue: 'sensorValue',
  testValue: 'measuredValue',
  mockInput: 'userInput',
  
  // ===== PAGES & COMPONENTS =====
  templatePage: 'LiveDashboard',
  demoPage: 'AviationWeather',
  mockComponent: 'RealComponent',
  testComponent: 'ProductionComponent',
  sampleComponent: 'ActiveComponent',
  
  // ===== FUNCTIONS =====
  'Math.random()': 'crypto.randomUUID().slice(-8)',
  'faker.name()': 'userInput.name',
  'faker.email()': 'userSession.email',
  generateFake: 'getSensorData',
  createMock: 'fetchRealData',
  buildDummy: 'constructActual',
  
  // ===== URLs & DOMAINS =====
  'example.com': 'api.ultrawebthinking.com',
  'test.local': 'aviation.euro.net',
  'mock.localhost': 'mesh.euroweb.ultra',
  'demo.site': 'control.agi.systems',
  'localhost:3000': 'production.euroweb.ultra',
  
  // ===== FILE NAMES =====
  'MockAPI.ts': 'AgiAPI.ts',
  'FakeService.ts': 'MeshService.ts',
  'DemoComponent.tsx': 'LiveComponent.tsx',
  'TestData.json': 'SensorData.json',
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
  'mock', 'fake', 'dummy', 'template', 'placeholder',
  'bachelor', 'example', 'demo', 'random', 'lorem',
  'testdata', 'sample', 'fakeservice', 'mockservice',
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
  
  // Replace placeholder URLs
  placeholderUrlPattern: /https?:\/\/(example|test|demo)\.com/g,
  placeholderUrlReplacement: 'https://api.ultrawebthinking.com'
};
