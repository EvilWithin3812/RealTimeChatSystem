import Login from '../components/login/login.jsx'

const LoginPage = ({ darkMode, setDarkMode }) => {
    return (
        <div>
            <Login darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
    );
}

export default LoginPage;                                      
