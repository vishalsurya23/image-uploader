import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddPost from './components/AddPost';

import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Navbar />

        <div className='pages'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddPost />} />
          </Routes>
        </div>
      </BrowserRouter>


    </div>
  );
}

export default App;
