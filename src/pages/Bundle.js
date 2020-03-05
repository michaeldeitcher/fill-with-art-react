import React, { useState, useEffect } from 'react';
import ApiClient from '../utility/ApiClient'
import axios from 'axios';
import {useParams} from "react-router-dom";
import LoadingSpinners from '../components/LoadingSpinners';
import CreateContribution from '../components/CreateContribution'
import {UserContext} from '../context/UserContext';
import "./Bundle.scss";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import {emitFlashMessage} from '../components/FlashMessage'

const BundleContributionSlide = (contribution) => {
    const {text, image_url, index} = contribution.contribution.attributes;
    return (
        <Slide index={index+1}>
            <h2>{text}</h2>
            <img src={ApiClient.imageUrl(image_url)} alt={text}/>
        </Slide>
    );
}

function Bundle(props) {
    let { id, sectionId } = useParams();
    const [bundle, setBundle] = useState(null);
    const [lastTokenUsed, setLastTokenUsed] = useState('');
    const [bundleContributions, setBundleContributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contributeMode, setContributeMode] = useState(false);

    useEffect(() => { 
        // load from cache
        if(props.location.state) {
            setBundle(props.location.state.bundle);
            setLastTokenUsed(props.location.state.bundle.attributes.last_anonymous_token_contribution);
            return;
        }
        
        setLoading(true);
        axios.get( `/bundles/${id}`, ApiClient.config(props.user) ).then( response => {
            setBundleContributions(response.data.included);
            setBundle(response.data.data);
            setLastTokenUsed(response.data.data.attributes.last_anonymous_token_contribution);
        }).catch( error => {
            console.log(error);
        }).then( () => setLoading(false) );
    }, [id, props]);

    const shareBundle = () => {
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state === "granted" || result.state === "prompt") {
                const newClip = "Please contribute to my bundle at: " + window.document.location.href;
                navigator.clipboard.writeText(newClip).then(() => {
                    emitFlashMessage("Link copied to clipboard", "success");
                }, () => {
                    emitFlashMessage("Failed to copy link to clipboard", "error");
                });                                
            }
          });
    }

    const contribute = () => {
        setContributeMode(true);
    }

    let actionButton;
    if(lastTokenUsed !== props.anonymousToken) {
        actionButton = (<button onClick={() => contribute()} type="button" className="btn btn-primary share">contribute</button>)
    } else {
        actionButton = (<button onClick={() => shareBundle()} type="button" className="btn btn-primary share">SHARE</button>)        
    }
  
    const contributionSlides = bundleContributions.map( (c) => 
        <BundleContributionSlide key={c.attributes.contribution_order} contribution={c}/>
    );

    const onContributeSuccess = (contribution) => {
        setLastTokenUsed(props.anonymousToken);
        setBundleContributions(bundleContributions.concat([contribution]));
        setContributeMode(false);
    }

    return (
      <div>
        { !contributeMode &&
        <div>
            { bundle &&
                <div className='show-bundle'>
                    <CarouselProvider
                        naturalSlideWidth={100}
                        naturalSlideHeight={125}
                        currentSlide={sectionId}
                        totalSlides={1+bundleContributions.length}
                    >
                    <Slider>
                        <Slide index={0}>
                            <h2>{bundle.attributes.title}</h2>
                            <img src={ApiClient.imageUrl(bundle.attributes.image_url)} alt={bundle.attributes.title}/>
                        </Slide>
                        {contributionSlides}
                    </Slider>
                    </CarouselProvider>         
                    {actionButton}
                </div>            
            }
            { loading && <LoadingSpinners/>}
        </div>
        }
        { contributeMode &&
            <CreateContribution bundle={bundle} user={props.user} 
                                anonymousToken={props.anonymousToken} onContributeSuccess={onContributeSuccess}/>
        }

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