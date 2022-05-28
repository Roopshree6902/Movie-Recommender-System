import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase';
import ReactDOM from 'react-dom';
import App from '../components/App';


const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const history = useHistory();

    useEffect (() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
            if (user) {
                ReactDOM.render(<App />, document.getElementById('root'));
            } 
            
        })
    }, [user, history]); 

    const value = { user };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
} 
