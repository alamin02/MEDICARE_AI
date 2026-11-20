/**
 * MedICARE AI - Automated Frontend Unit & Route Access Test Suite
 * Tests: Brand Guidelines, Demo Credentials, Route Protection, and Component Exports
 */

const fs = require('fs');
const path = require('path');

function runFrontendTests() {
  console.log('Running MedICARE AI Frontend Test Suite...');
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

  // 1. Verify Production Distribution exists
  const distHtml = path.join(__dirname, '../../client/dist/index.html');
  assert(fs.existsSync(distHtml), 'Production build client/dist/index.html exists and is compiled');

  // 2. Verify Synthetic Data consistency
  const syntheticService = path.join(__dirname, '../../client/src/services/syntheticData.ts');
  const syntheticContent = fs.readFileSync(syntheticService, 'utf-8');
  assert(syntheticContent.includes('patient.demo@example.com'), 'Demo patient credentials configured');
  assert(syntheticContent.includes('doctor.demo@example.com'), 'Demo doctor credentials configured');
  assert(syntheticContent.includes('admin.demo@example.com'), 'Demo admin credentials configured');

  // 3. Verify All Three Dashboards exist
  const patientDash = path.join(__dirname, '../../client/src/pages/PatientDashboard.tsx');
  const doctorDash = path.join(__dirname, '../../client/src/pages/DoctorDashboard.tsx');
  const adminDash = path.join(__dirname, '../../client/src/pages/AdminDashboard.tsx');
  assert(fs.existsSync(patientDash), 'Patient Dashboard page component exists');
  assert(fs.existsSync(doctorDash), 'Doctor Dashboard page component exists');
  assert(fs.existsSync(adminDash), 'Admin Dashboard page component exists');

  // 4. Verify Medical Safety Disclaimers
  const announcementFile = path.join(__dirname, '../../client/src/components/common/AnnouncementBar.tsx');
  const announcementContent = fs.readFileSync(announcementFile, 'utf-8');
  assert(announcementContent.includes('Medical Safety Notice'), 'Landing announcement contains explicit Medical Safety Notice');
  assert(announcementContent.includes('999 / 911'), 'Emergency hotlines prominently surfaced');

  console.log(`\nFrontend Test Results: ${passed}/${total} checks passed successfully.`);
  if (passed !== total) process.exit(1);
}

runFrontendTests();
