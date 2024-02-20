import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Agendas from './pages/agendas';
import Init from './pages/Init';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Init />} />
          <Route path='/agendas' element={<Agendas />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
