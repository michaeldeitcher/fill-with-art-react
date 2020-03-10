import React, { useState, useEffect } from 'react'
import ApiClient from '../utility/ApiClient'
import axios from 'axios'
import {Link} from "react-router-dom"
import { IoIosAddCircleOutline } from 'react-icons/io'
import LoadingSpinners from '../components/LoadingSpinners'
import AppButtonBar from '../AppButtonBar'

const Bundle = (props) => {
    const bundle = props.bundle;
    const attr = bundle.attributes;

    return (
        <Link to={{pathname: '/bundle/'+ attr.friendly_id, state: {bundle: bundle}}}>
            <li className='bundle border border-dark' style={{backgroundImage: `url(${ApiClient.imageUrl(attr.image_url)})`}}>
                <div className='title rounded'>{attr.title}</div>
            </li>
        </Link>
    )
}

export default function Bundles({user}) {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(user) {      
            setLoading(true);
            axios.get( '/bundles', ApiClient.config(user) ).then( response => {
                setBundles(response.data.data);
            }).catch( error => {
                console.log(error);
            }).then( () => setLoading(false) );
        } else {
            setBundles([]);
        }
    }, [user]);

    const listItems = bundles.map((bundle) =>
        <Bundle key={bundle.id} bundle={bundle}/>        
    );    

    return (
        <div className='bundles-page'>
            <ul className='bundles'>
                {listItems}
                { loading && <LoadingSpinners/>}
            </ul>
            <AppButtonBar>
                <Link to="/create-bundle">
                    <li><IoIosAddCircleOutline/></li>
                </Link>
            </AppButtonBar>      
        </div>
    )
}