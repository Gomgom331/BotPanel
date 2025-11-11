import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals'


// 언어팩
import './i18n'

// css
import "./styles/global.css"
import "./styles/Variables.css"


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <div>
      <App />
    </div>
);

reportWebVitals();
