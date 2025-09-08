// Test script to check if all components can be imported correctly
console.log('Testing component imports...');

async function testComponentImports() {
  try {
    console.log('1. Testing Login component...');
    const LoginModule = await import('./src/pages/auth/Login');
    console.log('   Login export:', LoginModule.Login ? '✅ Found' : '❌ Missing');
    
    console.log('2. Testing Register component...');
    const RegisterModule = await import('./src/pages/auth/Register');
    console.log('   Register export:', RegisterModule.Register ? '✅ Found' : '❌ Missing');
    
    console.log('3. Testing Dashboard component...');
    const DashboardModule = await import('./src/pages/Dashboard');
    console.log('   Dashboard default export:', DashboardModule.default ? '✅ Found' : '❌ Missing');
    
    console.log('4. Testing ReportsList component...');
    const ReportsListModule = await import('./src/pages/reports/ReportsList');
    console.log('   ReportsList export:', ReportsListModule.ReportsList ? '✅ Found' : '❌ Missing');
    
    console.log('5. Testing UploadReport component...');
    const UploadReportModule = await import('./src/pages/reports/UploadReport');
    console.log('   UploadReport export:', UploadReportModule.UploadReport ? '✅ Found' : '❌ Missing');
    
    console.log('6. Testing ReportDetails component...');
    const ReportDetailsModule = await import('./src/pages/reports/ReportDetails');
    console.log('   ReportDetails default export:', ReportDetailsModule.default ? '✅ Found' : '❌ Missing');
    
    console.log('7. Testing AdminDashboard component...');
    const AdminDashboardModule = await import('./src/pages/admin/AdminDashboard');
    console.log('   AdminDashboard export:', AdminDashboardModule.AdminDashboard ? '✅ Found' : '❌ Missing');
    
    console.log('\n🎯 All component imports tested!');
    
  } catch (error) {
    console.error('❌ Error testing components:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testComponentImports();
