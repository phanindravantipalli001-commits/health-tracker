import { useState } from 'react';
import { MODULES } from './app/registry';

function App() {
  const [activeId, setActiveId] = useState(MODULES[0].id);
  const active = MODULES.find((m) => m.id === activeId) ?? MODULES[0];
  const ActiveComponent = active.Component;

  return (
    <>
      <div className="app-header">
        <h1>Health Tracker</h1>
      </div>

      {MODULES.length > 1 && (
        <nav className="app-nav">
          {MODULES.map((m) => (
            <button key={m.id} className={m.id === activeId ? 'active' : ''} onClick={() => setActiveId(m.id)}>
              {m.label}
            </button>
          ))}
        </nav>
      )}

      <div className="disclaimer">
        Reference ranges shown are general adult ranges for orientation only, not medical advice — always defer to
        your lab's printed range and your doctor's interpretation. All data stays on this device.
      </div>

      <ActiveComponent />
    </>
  );
}

export default App;
