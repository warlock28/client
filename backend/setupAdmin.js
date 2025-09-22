import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// New admin credentials
const ADMIN_EMAIL = 'admin@lawfull.com';
const ADMIN_PASSWORD = 'admin123456';

const setupAdmin = () => {
  try {
    const envPath = path.join(__dirname, '.env');
    
    if (!fs.existsSync(envPath)) {
      console.error('.env file not found!');
      return;
    }

    // Read current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update admin credentials
    envContent = envContent.replace(
      /ADMIN_EMAIL=.*/,
      `ADMIN_EMAIL=${ADMIN_EMAIL}`
    );
    
    envContent = envContent.replace(
      /ADMIN_PASSWORD=.*/,
      `ADMIN_PASSWORD=${ADMIN_PASSWORD}`
    );

    // Write updated content back
    fs.writeFileSync(envPath, envContent);

    console.log('✅ Admin credentials updated successfully!');
    console.log('');
    console.log('🔐 New Admin Login Credentials:');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('');
    console.log('📝 Instructions:');
    console.log('1. Restart your backend server');
    console.log('2. Go to http://localhost:5174 (admin panel)');
    console.log('3. Select "Admin" user type');
    console.log('4. Login with the credentials above');
    console.log('');
    console.log('⚠️  Important: Change these credentials in production!');

  } catch (error) {
    console.error('Error setting up admin credentials:', error);
  }
};

setupAdmin();
