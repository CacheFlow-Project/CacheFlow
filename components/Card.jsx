export default function Card({ children }) {
  return (
    <div style={{
      backgroundColor: 'var(--background)',
      border: '1px solid var(--secondary)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      {children}
    </div>
  );
}