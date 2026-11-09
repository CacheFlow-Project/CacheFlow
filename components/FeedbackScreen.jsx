export default function FeedbackScreen({ isCorrect, message }) {
  // Alege culoarea în funcție de răspuns (verde pt corect, roșu pt greșit)
  const bgColor = isCorrect ? 'var(--accent)' : 'var(--destructive)';
  const title = isCorrect ? 'Corect!' : 'Greșit!';

  return (
    <div style={{
      backgroundColor: bgColor,
      color: 'white',
      padding: '24px',
      borderRadius: '12px',
      textAlign: 'center',
      marginBottom: '16px'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{title}</h2>
      <p style={{ fontSize: '16px' }}>{message}</p>
    </div>
  );
}