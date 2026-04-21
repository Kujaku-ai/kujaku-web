import bcrypt from 'bcryptjs';

const pw = process.argv[2];
if (!pw) {
  console.error('Usage: node scripts/hash-password.mjs <plaintext>');
  process.exit(1);
}
const hash = bcrypt.hashSync(pw, 10);
console.log(hash);
