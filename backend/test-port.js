const PORT = process.env.PORT || 5001;
console.log('🔍 Port Configuration:');
console.log('   Environment PORT:', process.env.PORT);
console.log('   Default PORT: 5001');
console.log('   Final PORT:', PORT);
console.log('   Health URL: http://localhost:' + PORT + '/api/health'); 