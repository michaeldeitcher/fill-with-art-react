import React, { useState, useEffect } from 'react';
import ApiClient from '../utility/ApiClient'
import axios from 'axios';
import {Link} from "react-router-dom";
import LoadingSpinners from './LoadingSpinners';

const Bundle = (props) => {
    const bundle = props.bundle;
    const attr = bundle.attributes;

    return (
        <Link to={'/bundle/'+ attr.friendly_id}>
            <li className='bundle border border-dark' style={{backgroundImage: `url(${ApiClient.imageUrl(attr.image_url)})`}}>
                <div className='title rounded'>{attr.title}</div>
            </li>
        </Link>
    )
}

export default function Bundles(props) {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(props.user) {      
            setLoading(true);
            axios.get( '/bundles', ApiClient.config(props.user) ).then( response => {
                setBundles(response.data.data);
            }).catch( error => {
                console.log(error);
            }).then( () => setLoading(false) );
        } else {
            setBundles([]);
        }
    }, [
        props.user,
    ]);

    const listItems = bundles.map((bundle) =>
        <Bundle key={bundle.id} bundle={bundle}/>        
    );    

    return (
        <ul className='bundles'>
            {listItems}
            { loading && <LoadingSpinners/>}
        </ul>
    )
}