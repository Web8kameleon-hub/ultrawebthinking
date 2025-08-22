// Test dynamic exports in TypeScript
import DualMindEngineDefault, { DualMindEngine } from './lib/dualMindEngine';

console.log('Named export DualMindEngine:', DualMindEngine);
console.log('Default export DualMindEngineDefault:', DualMindEngineDefault);
console.log('Named getInstance:', DualMindEngine?.getInstance);
console.log('Default getInstance:', DualMindEngineDefault?.getInstance);

// Test both patterns
try {
  if (DualMindEngine?.getInstance) {
    const instance1 = DualMindEngine.getInstance();
    console.log('Named export instance:', instance1);
  }
} catch (e) {
  console.error('Named export error:', e);
}

try {
  if (DualMindEngineDefault?.getInstance) {
    const instance2 = DualMindEngineDefault.getInstance();
    console.log('Default export instance:', instance2);
  }
} catch (e) {
  console.error('Default export error:', e);
}

export { };

