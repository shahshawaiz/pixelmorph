import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const correctPassword = process.env.NEXT_PUBLIC_PASSWORD || 'your-password';

      // Check if the cookie exists and matches the password
      const authCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth='));
      
      if (authCookie) {
        const authValue = authCookie.split('=')[1];
        if (authValue === correctPassword) {
          router.push('/'); // Redirect to index if authenticated
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const correctPassword = process.env.NEXT_PUBLIC_PASSWORD || 'your-password';

    if (password === correctPassword) {
      // Set the authentication cookie
      document.cookie = `auth=${password}; path=/`;

      // Redirect to the page the user came from or fallback to '/'
      const redirectPath = router.query.redirect || '/';
      router.push(redirectPath);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '1rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    marginBottom: '1rem',
    color: '#d32f2f',
    fontSize: '0.9rem',
  },
};
