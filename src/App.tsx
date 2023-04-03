import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import About from './pages/About/About';
import Editor from './Editor';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/editor" element={<Editor bits={[0,0,0,0,0,0,0,1]} />} />
      </Routes>
    </Router>
  );
};

export default App;
