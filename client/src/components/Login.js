import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import "../styles/Login.css"
import { auth } from '../firebase';
import firebase from 'firebase/app';
import "firebase/app";

const Login = () => {
    return (
        <div id="login-page">
            <div id="login-card">
            <h2>Welcome to Epic-Movie-Zone</h2> 
                <br /> 
                
                
                <div
                    className="login-button google"
                    onClick={() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}>
                    <GoogleIcon/> Sign In With Google
                </div>
                <br /><br />
                <div
                    className="login-button facebook"
                    onClick={() => {
                        if (!auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()))
                            alert("Invalid");
                        else
                            auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
                            
                    }}>
                    <FacebookIcon /> Sign In With Facebook
                </div>
                
                
                
                
                
            </div>
        </div>
    );
}

export default Login;