// Test login via the local Next.js server (port 3000)
const credentials = [
  { email: 'admin@qbar.com', password: 'admin123', label: 'Admin' },
  { email: 'operador@qbar.com', password: 'admin123', label: 'Operador' },
  { email: 'supervisor@qbar.com', password: 'admin123', label: 'Supervisor' },
];

async function testLogin(email, password, label) {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    const status = res.status === 200 ? '✅' : '❌';
    console.log(`${status} [${res.status}] ${label} (${email} / ${password})`);
    if (data.user) {
      console.log(`   -> Rol: ${data.user.rol}, Nombre: ${data.user.nombre}`);
    } else {
      console.log(`   -> ${data.error}`);
    }
  } catch (err) {
    console.log(`❌ [ERROR] ${label} => ${err.message}`);
  }
}

(async () => {
  console.log('=== Testing Login API at http://localhost:3000 ===\n');
  for (const { email, password, label } of credentials) {
    await testLogin(email, password, label);
  }
})();
