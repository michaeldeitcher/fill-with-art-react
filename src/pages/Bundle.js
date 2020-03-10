import React, { useState, useEffect } from 'react'
import ApiClient from '../utility/ApiClient'
import AppButtonBar from '../AppButtonBar'
import {Link} from "react-router-dom"
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
 

const BundleContributionSlide = (contribution) => {
    const {text, image_url, contribution_order} = contribution.contribution.attributes;
    return (
        <div key={contribution_order+1}>
            <h2>{text}</h2>
            <img src={ApiClient.imageUrl(image_url)} alt={text}/>
        </div>
    );
}

const ActionSlide = ({canContribute, contribute, isCompleted, index}) => {
    const shareBundle = () => {
        const newClip = "Please contribute to my bundle at: " + window.document.location.href
        copyToClipboard(newClip)
        emitFlashMessage("Link copied to clipboard", "success")
    }

    let actionButton;
    let actionCopy;
    if(canContribute) {
        actionButton = (<button onClick={() => contribute()} type="button" className="btn btn-primary share">contribute</button>)
        actionCopy = "It is your turn to contribute."
    } else {
        actionButton = (<button onClick={() => shareBundle()} type="button" className="btn btn-primary share">SHARE</button>)        
        actionCopy = "Ask a friend to contribute to the bundle by sharing it."
    }    
    return (
        <div key={index}>
            <div className="last-slide">
                <h2>{actionCopy}</h2>
                {actionButton}
            </div>
        </div>
    ) 

}

function Bundle(props) {
    let { id, sectionId } = useParams();
    const [bundle, setBundle] = useState(null);
    const [lastTokenUsed, setLastTokenUsed] = useState('');
    const [bundleContributions, setBundleContributions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [contributeMode, setContributeMode] = useState(false);
    const history = useHistory();

    useEffect(() => { 
        fixWindowScroll();
        // load from cache
        if(props.location.state) {
            setBundle(props.location.state.bundle);
            setLastTokenUsed(props.location.state.bundle.attributes.last_anonymous_token_contribution);
            history.replace();
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

        return function cleanup() {
            releaseWindowScroll();
        }
    }, [id, props]);
  
    const contributionSlides = bundleContributions.map( (c) => 
        <BundleContributionSlide key={c.attributes.contribution_order} contribution={c}/>
    );

    const onContributeSuccess = (contribution) => {
        setLastTokenUsed(props.anonymousToken);
        setBundleContributions(bundleContributions.concat([contribution]));
        setContributeMode(false);
    }

    const handleReceivedMessage = (data) => {
        const contribution = JSON.parse(data).data;
        if(bundleContributions.find( (bc) => {
            return bc.attributes.contribution_order === contribution.attributes.contribution_order;
        })) {
            return;
        }
        setLastTokenUsed(contribution.attributes.anonymous_token);
        setBundleContributions(bundleContributions.concat([contribution]));
        emitFlashMessage('New contribution received', 'success');
    }

    const canContribute = lastTokenUsed !== props.anonymousToken;

    const sliderSettings = {
        lazyLoad: true,
        infinite: false,
      };

    let slider;

    return (
      <div>
        { !contributeMode &&
        <div>
            { bundle &&
                <div className='show-bundle'>
                    <Slider ref={s => (slider = s)} {...sliderSettings}>
                        <div index={0}>
                            <h2>{bundle.attributes.title}</h2>
                            <img src={ApiClient.imageUrl(bundle.attributes.image_url)} alt={bundle.attributes.title}/>
                        </div>
                        {contributionSlides}
                        <ActionSlide canContribute={canContribute} 
                                    contribute={() => setContributeMode(true) } 
                                    index={bundleContributions.length+1}/>
                    </Slider>
                    <ActionCableConsumer 
                        channel={{ channel: 'BundleContributionsChannel', bundle: bundle.attributes.friendly_id }}
                        onReceived={handleReceivedMessage}
                    />                    
                </div>            
            }
            { loading && <LoadingSpinners/>}
        </div>
        }
        { contributeMode &&
            <CreateContribution bundle={bundle} user={props.user} 
                                anonymousToken={props.anonymousToken} onContributeSuccess={onContributeSuccess}/>
        }

        <AppButtonBar user={props.user}>
            <li className="blue" onClick={() => slider.slickGoTo(bundleContributions.length+1)}><IoMdFlower/></li>
        </AppButtonBar>  

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