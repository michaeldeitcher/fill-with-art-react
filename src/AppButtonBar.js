import React from 'react';
import { FiHome } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';
import {Link} from "react-router-dom";
import './AppButtonBar.scss';

  export default (props) => {
      return (
        <ul className='app-button-bar bottom'>
            <Link to="/">
                <li><FiHome/></li>
            </Link>    
            {props.children}            
            <Link to="/user">
                <li><FaRegUser/></li>
            </Link>                
        </ul> 
      );
  }