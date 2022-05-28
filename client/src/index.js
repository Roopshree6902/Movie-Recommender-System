import React from 'react';  
import ReactDOM from 'react-dom';   
import './index.css';   
import Login from './components/Login';
import { AuthProvider } from "./contexts/AuthContext";
require("dotenv").config();


ReactDOM.render(<AuthProvider><Login/></AuthProvider>, document.getElementById('root'));  
