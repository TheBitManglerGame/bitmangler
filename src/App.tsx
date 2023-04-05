import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import About from './pages/About/About';
import HomePage from './pages/HomePage/HomePage';
import Editor from './Editor';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/editor" element={<Editor bits={[0,0,0,0,0,0,0,1]} targetBits={[1,1,0,0,0,0,1,0]} />} />
      </Routes>
  </Router>
  );
};

export default App;
