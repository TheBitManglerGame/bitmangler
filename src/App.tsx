import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import About from './pages/About/About';
import HomePage from './pages/HomePage/HomePage';
import Editor from './Editor';
import PuzzleSession from './Session';
import { ONE, ZERO } from './Common';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/puzzle" element={<PuzzleSession />} />
        <Route path="/editor" element={<Editor bits={ZERO} targetBits={ONE} solverSolution={null} onNewGame={()=>{}}/>} />
      </Routes>
  </Router>
  );
};

export default App;
