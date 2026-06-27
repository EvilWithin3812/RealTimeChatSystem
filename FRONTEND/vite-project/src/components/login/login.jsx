import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaMoon, FaSignInAlt, FaSun } from 'react-icons/fa';
import './login.css'

const Login = ({ darkMode, setDarkMode }) => {
    const navigate = useNavigate();
    let [formdata , setformdata] = useState({
        username : "",
        password : "",
    });

    const onhandlechange = (event)=>{
        let name = event.target.name;
        let value = event.target.value;

        setformdata((curr) =>{
            curr[name] = value;
            return {...curr};
        })
    };

    const onhandlesubmit = async (event)=>{
        event.preventDefault();

        try {
            await axios.post('/api/user/login', formdata);
            navigate('/home');
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <main className={`auth-page ${darkMode ? 'dark' : 'bright'}`}>
        <button className="auth-theme-toggle" type="button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle color mode">
            {darkMode ? <FaSun /> : <FaMoon />}
            <span>{darkMode ? 'White mode' : 'Dark mode'}</span>
        </button>
        <section className='login auth-panel'>
        <div className="auth-kicker">Welcome back</div>
        <h1>Log in</h1>
        <p className="auth-copy">Pick up your chats where you left them.</p>
            <form onSubmit={onhandlesubmit}>
            <div className="mb-3">
                <label htmlFor="Username" className="form-label">Username</label>
                <input type="text" className="form-control" id="Username" onChange={onhandlechange} name='username' value={formdata.username} required />
            </div>
            <div className="mb-3">
                <label htmlFor="Password1" className="form-label">Password</label>
                <input type="password" className="form-control" id="Password1" onChange={onhandlechange} name='password' value={formdata.password} required />
            </div>
            <button type="submit" className="btn btn-dark auth-submit"><FaSignInAlt /> Log in</button>
            </form>
            <p className="auth-switch">Need an account? <Link to="/signup">Create one</Link></p>
        </section>
        </main>
    );
}

export default Login;
