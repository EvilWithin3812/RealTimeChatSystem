import { FaUsers, FaCog, FaSignOutAlt, FaPhone, FaVideo, FaSun, FaMoon } from "react-icons/fa";
import './navbar.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
     // State to toggle dark/bright mode
    const navigate =useNavigate();

    const toggleMode = () => {
      props.setDarkMode(!props.darkMode);
    };

    const showleftbar =()=>{
        props.setisopen(!props.isopen);
    }


    const hanglelogout = ()=>{
       axios.post('/api/user/logout')
       .then(()=>{
          navigate('/signup');
       })
       .catch((err)=>{
        console.log(err);
       })
    }


    return (
    <div className={`sidebar ${props.darkMode ? "dark" : "bright"}`}>
      <ul>
        <li onClick={showleftbar}>
          <FaUsers /> 
        </li>
        <li>
          <FaCog />
        </li>
        <li>
          <FaPhone /> 
        </li>
        <li>
          <FaVideo /> 
        </li>
        <li>
          <FaSignOutAlt onClick={hanglelogout}/>
        </li>
      </ul>

      <button className="mode-toggle" onClick={toggleMode} aria-label="Toggle color mode" title={props.darkMode ? 'White mode' : 'Dark mode'}>
        {props.darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
    );
}

export default Navbar;
