export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text)'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
      <p style={{ color: 'var(--muted)' }}>Page not found</p>
      <a href="/" style={{ marginTop: '24px', color: 'var(--accent)' }}>← Back to home</a>
    </div>
  )
}
