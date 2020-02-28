import React, { useState, useEffect } from 'react';
import ApiClient from '../utility/ApiClient'
import axios from 'axios';
import {Link, useParams} from "react-router-dom";
import LoadingSpinners from './LoadingSpinners';

export default function Bundles(props) {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();
  
    return (
      <div>
        <h3>ID: {id}</h3>
      </div>
    );
  }