'use client';

import DecisionForm from '../components/DecisionForm';

export default function Page() {
  return (
    <main className="container">
      <header className="header">
        <div className="badge">🎯 Slim kiezen</div>
        <h1 className="title">LEGO® Keuzehulp</h1>
        <p className="subtitle">Beantwoord een paar vragen en krijg direct 3 sets die bij je passen.</p>
      </header>

      <section className="card">
        <DecisionForm />
      </section>

      <p className="footer">
        Niet officieel geaffilieerd met The LEGO Group. LEGO® is een handelsmerk van The LEGO Group.
      </p>
    </main>
  );
}