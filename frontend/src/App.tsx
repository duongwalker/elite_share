import './App.css'
import Activities from './components/Activities/Activities';
import Dashboard from './components/Dashboard/Dashboard'
import Friends from './components/Friends/Friends';
import { Groups } from './components/Groups/Groups';
import Navbar from './components/Navbar/Navbar'
import { Routes, Route, useLocation } from "react-router-dom";
import Settings from './components/Settings/Settings';
import { Login } from './components/Login/Login';
import { GroupExpenses } from './components/Groups/GroupExpenses';




function App() {
  const location = useLocation();
  return (
    <div className='flex w-full'>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='friends' element={<Friends />} />
        <Route path='groups' element={<Groups />} />
        <Route path='groups/:id' element={<GroupExpenses />} />
        <Route path='friends' element={<Friends />} />
        <Route path='activities' element={<Activities />} />
        <Route path='settings' element={<Settings />} />
      </Routes>
    </div>
  )
}

export default App
