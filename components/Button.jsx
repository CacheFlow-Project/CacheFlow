export default function Button({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
      padding: '10px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '16px'
    }}>
      {children}
    </button>
  );
}