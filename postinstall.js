const { execSync } = require('child_process');

// Generate Prisma client after npm install
try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}