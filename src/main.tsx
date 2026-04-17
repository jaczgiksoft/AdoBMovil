import React from 'react';
import { createRoot } from 'react-dom/client';

/* Ionic core CSS */
import '@ionic/react/css/core.css';

/* Ionic basic CSS utilities */
//import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
//import '@ionic/react/css/typography.css';

/* Ionic optional CSS utilities */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic palettes (dark mode support) */
//import '@ionic/react/css/palettes/dark.system.css';

/* App global styles */
import './styles/global.css';

import AppRouter from './app/AppRouter';
import { PatientProvider } from './core/context/PatientContext';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <PatientProvider>
      <AppRouter />
    </PatientProvider>
  </React.StrictMode>
);

