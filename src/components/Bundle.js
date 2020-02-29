import React, { useState, useEffect } from 'react';
import ApiClient from '../utility/ApiClient'
import axios from 'axios';
import {Link, useParams} from "react-router-dom";
import LoadingSpinners from './LoadingSpinners';

export default function Bundle(props) {
    let { id } = useParams();
    const [bundle, setBundle] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        if(!props.user)
            return;
        
        setLoading(true);
        axios.get( `/bundles/${id}`, ApiClient.config(props.user) ).then( response => {
            setBundle(response.data.data);
        }).catch( error => {
            console.log(error);
        }).then( () => setLoading(false) );
    }, [id, props.user]);
  
    return (
      <div>
        { bundle &&
            <div>
                <h2>{bundle.attributes.title}</h2>
                <img src={ApiClient.imageUrl(bundle.attributes.image_url)}/>
            </div>
        }
        { loading && <LoadingSpinners/>}
      </div>
    );
  }