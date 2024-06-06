import { Link } from 'react-router-dom'
import {
  logo,
  menu,
  dashboard,
  friendsIcon,
  groupsIcon,
  activitiesIcon,
  settingsIcon,
  closeIcon
} from '../../utils/icons'
import NavItem from './NavItem'
import { useState } from 'react'

const Navbar = () => {
  const [isClosed, setIsClosed] = useState(false)
  const toggleNavbar = () => {
    setIsClosed(!isClosed)
  }
  return (
    <div className={`navbar w-44 h-screen bg-[#FFFF] justify-items-center fixed top-0 left-0  ${!isClosed ? 'w-fit' : ''}`}>
      <div className='flex'>
        <img src={closeIcon} className={`'menu w-8 h-8 py-1 my-2 cursor-pointer ${!isClosed ? 'hidden' : ''}`} onClick={toggleNavbar}></img>
        <img src={menu} className={`'menu w-8 h-8 py-1 my-2 cursor-pointer ${isClosed ? 'hidden' : ''}`} onClick={toggleNavbar}></img>
        <Link to={'dashboard'}>
          <img src={logo} className={`w-12 h-12 py-0.5 my-0.5 cursor-pointer `} ></img>
        </Link>
      </div>
      <ul className={`font-bold my-14 ${!isClosed ? 'hidden' : ''}`}>
        <NavItem name='Dashboard' path='dashboard' icon={dashboard} />
        <NavItem name='Friends' path='friends' icon={friendsIcon} />
        <NavItem name='Groups' path='groups' icon={groupsIcon} />
        <NavItem name='Activities' path='activities' icon={activitiesIcon} />
        <NavItem name='Settings' path='settings' icon={settingsIcon} />

      </ul>
    </div>
  )
}

export default Navbar