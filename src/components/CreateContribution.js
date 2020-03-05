import React, { useState, useEffect } from 'react';
import ApiClient from '../utility/ApiClient'
import {emitFlashMessage} from './FlashMessage'
import axios from 'axios';
import ImageCanvas from './ImageCanvas'
import { FaCamera } from 'react-icons/fa';

export default ({bundle, user, anonymousToken, onContributeSuccess}) => {  
    const [pending, setPending] = useState(false);
    const [title, setTitle] = useState('');
    const [showCamera, setShowCamera] = useState(true);
    const [imageBlob, setImageBlob] = useState('');
    const [previewImgSrc, setPreviewImgSrc] = useState('');

    const handleSuccess = (response) => {    
        emitFlashMessage("Successfully added your contribution!", "success");
        onContributeSuccess(response.data.data);        
    }
    const handleError = () => {        
    }

    const onFormSubmit = (event) => {
        event.preventDefault();
        if(pending)
            return;
        if(!imageBlob) {
            emitFlashMessage("Please select and image", "warning");
            return;
        }
    
        setPending(true);
    
        const authorization_token = user ? `Token token=${user.authentication_token}, email=${user.email}` : '';
    
        const formData = new FormData();
        formData.set("bundle_contribution[bundle_id]", bundle.attributes.friendly_id);
        formData.set("bundle_contribution[anonymous_token]", anonymousToken);
        formData.set("bundle_contribution[text]", title);
        formData.append('bundle_contribution[image]', imageBlob, 'filename.png');      
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: authorization_token            
            }
        }
        axios.post( ApiClient.apiRoot + '/bundle_contributions', formData, config).then( (response) => {
            if( response.status === 201 )
              handleSuccess(response);
          })
          .catch( (error) => {
            if( error.response && error.response.status === 422 )
              handleError(error.response);
            else 
                emitFlashMessage("Sorry, something went wrong creating your bundle.", "error");
                console.error(error);
          })
          .finally(()=>{setPending(false);});      
      }

    const showImagePreview = (file) => {
        if(!file)
            return;

        let reader = new FileReader()
        reader.onload = (e) => {
            setPreviewImgSrc(e.target.result);
        }
        reader.file = file
        reader.readAsDataURL(file)
    }
  
    const onImageBlob = data => {
        setImageBlob(data);
        setShowCamera(false);
    }
  
    const cameraClassName = `camera trans-show ${showCamera ? "show" : "hide"}`;  

    return (
      <div>
        { !pending &&
        <div className='bundle bundle-create'>
            <h2>Add your contribution</h2>
            <div className={cameraClassName}><FaCamera/>
                <input type="file" onChange={(e) => showImagePreview(e.target.files[0])} />
            </div>
            <form onSubmit={(e) => onFormSubmit(e)}>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value) }/>
                <input type="submit" className="submit btn btn-primary" value={!pending ? "Add contribution" : "Adding..."} />
            </form>
            <ImageCanvas imageSrc={previewImgSrc} onImageBlob={onImageBlob}/>        
        </div>
        }
        { pending &&
            <h2>Adding your contribution...</h2>
        }
      </div>
    );
  }