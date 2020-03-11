import React, { useState, useEffect } from 'react'
import ApiClient from '../utility/ApiClient'
import AppButtonBar from '../AppButtonBar'
import { IoMdFlower } from "react-icons/io"
import axios from 'axios'
import {useParams} from "react-router-dom"
import LoadingSpinners from '../components/LoadingSpinners'
import CreateContribution from '../components/CreateContribution'
import {UserContext} from '../context/UserContext'
import "./Bundle.scss"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import {emitFlashMessage} from '../components/FlashMessage'
import copyToClipboard from '../utility/copyToClipboard'
import { useHistory } from "react-router-dom";
import { ActionCableConsumer } from 'react-actioncable-provider';
import { fixWindowScroll, releaseWindowScroll} from '../utility/iOSSafariHacks';
import './PrintBundle.scss'

let imagesLoaded = 0;
let imageCount = -1;
const onImageLoad = () => {
    if(imageCount === -1)
        return;
    imagesLoaded += 1;
    if(imageCount === imagesLoaded){
        console.log(imagesLoaded);
        imagesLoaded = 0;
        imageCount = -1;
        window.print();
    }
}

const PrintBundlePageSection = ({section}) => {
    return (
        <div className='section' key={section.index}>
            {/* <h2>{text}</h2> */}
            <img src={ApiClient.imageUrl(section.imageUrl)} alt={section.title} onLoad={() => onImageLoad()}/>
        </div>
    )
}

const PrintBundlePage = ({sections, i}) => {
    const printSections = sections.map( section => 
        <PrintBundlePageSection section={section}/>
    )
    const style = {top: (i*11) + 'in'};
    return (
        <div className='print-bundle' style={style}>
            {printSections}
        </div>  
    )
}

function Bundle(props) {
    let { id } = useParams();
    const [bundle, setBundle] = useState(null);
    const [bundleContributions, setBundleContributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => { 
        setLoading(true);
        axios.get( `/bundles/${id}`, ApiClient.config(props.user) ).then( response => {
            setBundleContributions(response.data.included);
            setBundle(response.data.data);
        }).catch( error => {
            console.log(error);
        }).then( () => setLoading(false) );
    }, [id, props]);

    useEffect(() => {
        fixWindowScroll();
        window.onafterprint = () => {
            window.onafterprint = null;
            window.history.back();
        }
        return function cleanup() {
            releaseWindowScroll();
        }
    },[]);

    let printData = [];
    let sectionIndex = 0;
    let printSectionContent = [];
    
    if(bundle){
        imageCount = 1 + bundleContributions.length;
        printSectionContent = [{imageUrl: bundle.attributes.image_url, title: bundle.attributes.title, index: 0}];
        while(sectionIndex < bundleContributions.length) {
            let attr = bundleContributions[sectionIndex].attributes;
            printSectionContent.push({imageUrl: attr.image_url, title: attr.text, index: attr.contribution_order+1})
            if(printSectionContent.length === 4){
                printData.push(printSectionContent);
                printSectionContent = [];
            }
            sectionIndex += 1;
        }

        if(printSectionContent.length > 0)
        printData.push(printSectionContent);        
    }    

    const printPages = printData.map( (data,i) => {
        return (<PrintBundlePage sections={data} i={i}/>);
    })

    return (
      <div>
        { bundle &&
            <div>
                { printPages }
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
            <Bundle location = {props.location} user={context.user} anonymousToken={context.anonymousToken}/>               
        )}
        </UserContext.Consumer>
    )
}