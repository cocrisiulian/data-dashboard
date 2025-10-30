'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  plan_id?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [planId, setPlanId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase.from('users').select('*');
    if (error) setError(error.message);
    else setUsers(data || []);
    setLoading(false);
  }

  async function createUser() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('users').insert([
      {
        email,
        full_name: fullName,
        plan_id: planId || null
      }
    ]);
    if (error) setError(error.message);
    setEmail('');
    setFullName('');
    setPlanId('');
    await fetchUsers();
    setLoading(false);
  }

  async function deleteUser(id: string) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) setError(error.message);
    await fetchUsers();
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50">
      <h1 className="text-2xl font-bold">CRUD Utilizatori</h1>
      <div className="flex gap-4 mb-4">
        <a href="/" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Pagina principală</a>
        <a href="/check-db" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Verifică baza de date</a>
      </div>
      <form
        className="flex flex-col gap-2 bg-white p-4 rounded shadow"
        onSubmit={e => {
          e.preventDefault();
          createUser();
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Nume complet (opțional)"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Plan ID (opțional)"
          value={planId}
          onChange={e => setPlanId(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={loading}
        >Adaugă utilizator</button>
      </form>
      {error && <div className="text-red-600">Eroare: {error}</div>}
      <div className="bg-white p-4 rounded shadow w-full max-w-md">
        <h2 className="font-semibold mb-2">Lista utilizatori</h2>
        {loading ? (
          <div>Se încarcă...</div>
        ) : (
          <ul>
            {users.map(user => (
              <li key={user.id} className="flex justify-between items-center py-1 border-b">
                <span>
                  {user.email}
                  {user.full_name && ` (${user.full_name})`}
                  {user.plan_id && ` | Plan: ${user.plan_id}`}
                </span>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => deleteUser(user.id)}
                  disabled={loading}
                >Șterge</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
