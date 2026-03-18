import bcrypt from 'bcryptjs';

const newPassword = 'admin123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(newPassword, salt);

console.log('New bcrypt hash for "admin123":');
console.log(hash);
