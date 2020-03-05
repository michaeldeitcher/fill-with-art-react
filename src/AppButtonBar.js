import React from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FiHome } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa';
import {Link} from "react-router-dom";
import './AppButtonBar.scss';

  export default () => {
      return (
        <ul className='app-button-bar bottom'>
            <Link to="/">
                <li><FiHome/></li>
            </Link>                
            <Link to="/create-bundle">
                <li><IoIosAddCircleOutline/></li>
            </Link>
            <Link to="/user">
                <li><FaRegUser/></li>
            </Link>                
        </ul> 
      );
  }