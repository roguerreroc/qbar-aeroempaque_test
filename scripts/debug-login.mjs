import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://wjjupjyxlcwoebxsnhfr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqanVwanl4bGN3b2VieHNuaGZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc4Mzc3OSwiZXhwIjoyMDg5MzU5Nzc5fQ.xo1NOQ4LybrJzbl3zFO9kQBdl1_cH9ZH8zXgRIKsjxY';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function debug() {
  console.log('1. Querying usuarios table...');
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', 'admin@qbar.com')
    .single();

  if (error) {
    console.log('SUPABASE ERROR:', JSON.stringify(error, null, 2));
    return;
  }

  console.log('2. User found:', {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    password_length: user.password?.length,
  });

  console.log('3. Testing bcrypt compare with "admin123"...');
  const isValid = bcrypt.compareSync('admin123', user.password);
  console.log('   Result:', isValid);

  if (isValid) {
    console.log('✅ LOGIN WOULD SUCCEED with admin@qbar.com / admin123');
  } else {
    console.log('❌ LOGIN FAILS - password mismatch');
    console.log('Stored hash:', user.password);
  }
}

debug().catch(console.error);
