

require('dotenv').config();
console.log('Loaded DB_USER:', process.env.DB_USER);
console.log('Loaded DB_PASSWORD:', process.env.DB_PASSWORD ? '(set)' : '(empty)');
