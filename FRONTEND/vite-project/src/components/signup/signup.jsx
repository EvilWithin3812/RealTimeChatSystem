import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun, FaUserPlus } from 'react-icons/fa';

import axios from 'axios'
import './signup.css'

const Signup = ({ darkMode, setDarkMode }) => {

    const navigate = useNavigate();

    let [formdata , setformdata] = useState({
        username : "",
        email : "",
        password : "",
        profilepic : null,
    });
    

    const onhandlechange = (event)=>{
        let name = event.target.name;
        let value = event.target.value;

        setformdata((curr) =>{
            curr[name] = value;
            return {...curr};
        })
    };
    
    const onhandlefile = (event)=>{
        setformdata((curr)=>{
            return {...curr,profilepic  : event.target.files[0]};
        });
    }
    const onhandlesubmit = async (event)=>{
        event.preventDefault();

        const data = new FormData();
        data.append('username', formdata.username);
        data.append('email', formdata.email);
        data.append('password', formdata.password);
        if (formdata.profilepic) {
            data.append('profilepic', formdata.profilepic);
        }
       try{
        await axios.post('/api/user/signup',data ,{
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
        );
            
        navigate('/home');
    

       }catch(err) {
        if (err.response) {
            console.log('Error response:', err.response.data);
        }
    }
    }

    return (   
       <main className={`auth-page ${darkMode ? 'dark' : 'bright'}`}>
       <button className="auth-theme-toggle" type="button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle color mode">
        {darkMode ? <FaSun /> : <FaMoon />}
        <span>{darkMode ? 'White mode' : 'Dark mode'}</span>
       </button>
       <section className='form signup auth-panel'>
        <div className="auth-kicker">Real-time chat</div>
        <h1>Create account</h1>
        <p className="auth-copy">Join the conversation with a clean profile and a fresh chat space.</p>
        <form encType='multipart/form-data' onSubmit={onhandlesubmit}>
            <div className="mb-3">
                <label htmlFor="Username" className="form-label">Username</label>
                <input type="text" className="form-control" id="Username" onChange={onhandlechange} name='username' value={formdata.username} required />
            </div>
            <div className="mb-3">
                <label htmlFor="Email1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="Email1" aria-describedby="emailHelp" onChange={onhandlechange} name='email' value={formdata.email} required />
            </div>
            <div className="mb-3">
                <label htmlFor="formFile" className="form-label">Profile Pic</label>
                <input className="form-control form-control" id="formFile" type="file" onChange={onhandlefile}/>
            </div>
            <div className="mb-3">
                <label htmlFor="Password1" className="form-label">Password</label>
                <input type="password" className="form-control" id="Password1" onChange={onhandlechange} name='password' value={formdata.password} required />
            </div>
            <button type="submit" className="btn btn-dark auth-submit"><FaUserPlus /> Create account</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
       </section>
       </main>
    );
}

export default Signup;
