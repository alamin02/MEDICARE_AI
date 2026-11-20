/**
 * MedICARE AI - Unified Frontend Integration & Functional Test Runner
 * Executes:
 * 1. Build & Distribution artifacts verification
 * 2. Demo credentials and synthetic boundary checks
 * 3. Functional tests via node:test suite execution
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function runAllFrontendTests() {
  console.log('====================================================');
  console.log('MedICARE AI Frontend Functional & Security Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // 1. Verify Production Distribution
  const distHtml = path.join(__dirname, '../../client/dist/index.html');
  assert(fs.existsSync(distHtml), 'Compiled production bundle client/dist/index.html exists');

  // 2. Verify Demo Credentials
  const syntheticService = path.join(__dirname, '../../client/src/services/syntheticData.ts');
  const syntheticContent = fs.readFileSync(syntheticService, 'utf-8');
  assert(syntheticContent.includes('patient.demo@example.com'), 'Demo patient account configured');
  assert(syntheticContent.includes('doctor.demo@example.com'), 'Demo doctor account configured');
  assert(syntheticContent.includes('admin.demo@example.com'), 'Demo admin account configured');

  // 3. Verify Medical Safety Disclaimers
  const announcementFile = path.join(__dirname, '../../client/src/components/common/AnnouncementBar.tsx');
  const announcementContent = fs.readFileSync(announcementFile, 'utf-8');
  assert(announcementContent.includes('Medical Safety Notice'), 'Prominent Medical Safety Notice present in UI');
  assert(announcementContent.includes('999 / 911'), 'National emergency hotlines (999/911) rendered');

  // 4. Run Functional Tests
  console.log('\nRunning Functional Logic Tests (node:test)...');
  const functionalScript = path.join(__dirname, 'functional_tests.test.js');
  const runResult = spawnSync('node', ['--test', functionalScript], { encoding: 'utf-8' });

  if (runResult.status === 0) {
    console.log(runResult.stdout);
    assert(true, 'All 5 functional logic test suites passed (Auth, RBAC, Double-booking, Emergency AI, File Validation)');
  } else {
    console.error(runResult.stderr || runResult.stdout);
    assert(false, 'Functional test suite failed');
  }

  console.log(`\n====================================================`);
  console.log(`Overall Result: ${passed}/${total} checks passed successfully.`);
  console.log(`====================================================`);

  if (passed !== total) process.exit(1);
}

runAllFrontendTests();
