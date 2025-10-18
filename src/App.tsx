import './App.css';
import type { Brett } from './schach/types';
import { Chessboard } from './schach/Chessboard';

const startBrett: Brett = [
  [
    { art: 'turm', farbe: 'b' },
    { art: 'pferd', farbe: 'b' },
    { art: 'laeufer', farbe: 'b' },
    { art: 'dame', farbe: 'b' },
    { art: 'koenig', farbe: 'b' },
    { art: 'laeufer', farbe: 'b' },
    { art: 'pferd', farbe: 'b' },
    { art: 'turm', farbe: 'b' },
  ],
  [
    { art: 'bauer', farbe: 'b' },
    { art: 'bauer', farbe: 'b' },
    { art: 'bauer', farbe: 'b' },
    { art: 'bauer', farbe: 'b' },
    { art: 'bauer', farbe: 'b' },
    { art: 'bauer', farbe: 'b' },
    { art: 'bauer', farbe: 'b' },
    { art: 'bauer', farbe: 'b' },
  ],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [
    { art: 'bauer', farbe: 'w' },
    { art: 'bauer', farbe: 'w' },
    { art: 'bauer', farbe: 'w' },
    { art: 'bauer', farbe: 'w' },
    { art: 'bauer', farbe: 'w' },
    { art: 'bauer', farbe: 'w' },
    { art: 'bauer', farbe: 'w' },
    { art: 'bauer', farbe: 'w' },
  ],
  [
    { art: 'turm', farbe: 'w' },
    { art: 'pferd', farbe: 'w' },
    { art: 'laeufer', farbe: 'w' },
    { art: 'dame', farbe: 'w' },
    { art: 'koenig', farbe: 'w' },
    { art: 'laeufer', farbe: 'w' },
    { art: 'pferd', farbe: 'w' },
    { art: 'turm', farbe: 'w' },
  ],
] satisfies Brett;

function App() {
  return (
    <div className="app">
      <h1 className="app__title">Schachmeister</h1>
      <p className="app__subtitle">Das Brett steht bereit – die Partie kann warten.</p>
      <Chessboard brett={startBrett} />
    </div>
  );
}

export default App;
