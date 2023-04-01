import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import About from './About';
import Editor from './Editor';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/editor" element={<Editor bits={[0,0,0,0,0,0,0,0]} />} />
      </Routes>
    </Router>
  );
};

export default App;
