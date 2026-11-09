export default function ProgressBar({ progress }) {
  return (
    <div style={{
      width: '100%',
      height: '8px',
      backgroundColor: 'var(--secondary)',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        backgroundColor: 'var(--primary)',
        transition: 'width 0.3s ease'
      }} />
    </div>
  );
}