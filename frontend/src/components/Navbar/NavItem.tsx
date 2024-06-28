
// import logo from '../../assets/money-svgrepo-com.svg';
import { Link } from "react-router-dom"
interface NavItemProps {
    name: string
    path: string
    icon: string
}

const NavItem: React.FC<NavItemProps> = ({ name, path, icon }) => {
    return (
        <div>
            <Link to={path}>
                <li className='flex my-3 hover:text-[#464BD8] hover:bg-[#EEEEEE] hover:rounded-md    cursor-pointer'>
                    <img src={icon} className='w-8 h-8 mx-2' style={{ fill: 'blue' }}></img>
                    <span className='mx-2 my-1'>
                        {name}
                    </span>
                </li>
            </Link>
        </div>
    )
}

export default NavItem