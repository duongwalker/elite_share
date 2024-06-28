import './App.css'
import Activities from './components/Activities/Activities';
import Dashboard from './components/Dashboard/Dashboard'
import Friends from './components/Friends/Friends';
import Groups from './components/Groups/Groups';
import Navbar from './components/Navbar/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Settings from './components/Settings/Settings';
function App() {
  return (
    <BrowserRouter>
      <div className='flex w-full'>
        <Navbar />  
        <Routes>
        <Route path='/' element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='friends' element={<Friends />} />
          <Route path='groups' element={<Groups />} />
          <Route path='friends' element={<Friends />} />
          <Route path='activities' element={<Activities />} />
          <Route path='settings' element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
