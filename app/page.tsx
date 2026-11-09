"use client";

import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import FeedbackScreen from '../components/FeedbackScreen';

export default function Home() {
  
  const [etapa, setEtapa] = useState("start"); 
  const [esteCorect, setEsteCorect] = useState(false);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Demo Interactiv - Tichet #3</h1>

      {/* ECRANUL 1: Start */}
      {etapa === "start" && (
        <Card>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Progresul tău</h2>
          <p style={{ color: 'var(--secondary-foreground)', marginBottom: '16px', fontSize: '14px' }}>
            Ai finalizat 60% din nivelul curent.
          </p>
          <ProgressBar progress={60} />
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button onClick={() => setEtapa("intrebare")}>Începe testul</Button>
          </div>
        </Card>
      )}

      {/* ECRANUL 2: Întrebarea */}
      {etapa === "intrebare" && (
        <Card>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>
            Care este regula ideală pentru împărțirea bugetului personal?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button onClick={() => { setEsteCorect(false); setEtapa("rezultat"); }}>
              80% dorințe, 20% nevoi
            </Button>
            <Button onClick={() => { setEsteCorect(true); setEtapa("rezultat"); }}>
              Regula 50/30/20
            </Button>
          </div>
        </Card>
      )}

      {/* ECRANUL 3: Răspunsul (Corect/Greșit) */}
      {etapa === "rezultat" && (
        <div>
          <FeedbackScreen 
            isCorrect={esteCorect} 
            message={esteCorect ? "Perfect! Ai învățat regula de bază." : "Nu e chiar așa. Regula corectă este 50/30/20."} 
          />
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button onClick={() => setEtapa("start")}>Încearcă din nou</Button>
          </div>
        </div>
      )}
    </main>
  );
}
