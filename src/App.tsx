import { Shell } from './components/Layout/Shell';

function App() {
  return (
    <Shell>
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--jee-header-bg)' }}>Welcome to JEE Pulse</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Your all-in-one high-performance study center for JEE Advanced.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', boxShadow: 'var(--shadow)', width: '200px' }}>
            <h3 style={{ color: 'var(--primary)' }}>TEST</h3>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Exam Simulator</p>
          </div>
          <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', boxShadow: 'var(--shadow)', width: '200px' }}>
            <h3 style={{ color: 'var(--primary)' }}>ANALYZE</h3>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Performance Insights</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default App;
