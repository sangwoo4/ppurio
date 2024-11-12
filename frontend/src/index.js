import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import Header from './components/Header';
import Footer from './components/Footer';

import { UserProvider } from './hooks/UserContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <Header />
      <App />
      <Footer />
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </UserProvider>
);
