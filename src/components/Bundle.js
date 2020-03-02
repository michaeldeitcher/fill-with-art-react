import React, { useState, useEffect } from 'react';
import ApiClient from '../utility/ApiClient'
import axios from 'axios';
import {useParams} from "react-router-dom";
import LoadingSpinners from './LoadingSpinners';
import {UserContext} from '../context/UserContext';

function Bundle(props) {
    let { id } = useParams();
    const [bundle, setBundle] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        // load from cache
        if(props.location.state) {
            setBundle(props.location.state.bundle);
            return;
        }

        if(!props.user)
            return;
        
        setLoading(true);
        axios.get( `/bundles/${id}`, ApiClient.config(props.user) ).then( response => {
            setBundle(response.data.data);
        }).catch( error => {
            console.log(error);
        }).then( () => setLoading(false) );
    }, [id, props]);
  
    return (
      <div>
        { bundle &&
            <div>
                <h2>{bundle.attributes.title}</h2>
                <img src={ApiClient.imageUrl(bundle.attributes.image_url)} alt={bundle.attributes.title}/>
            </div>
        }
        { loading && <LoadingSpinners/>}
      </div>
    );
  }

export default (props) => {
    return (
        <UserContext.Consumer>
        {(context) => (
            <Bundle location = {props.location} user={context.user}/>
        )}
        </UserContext.Consumer>
    )
}