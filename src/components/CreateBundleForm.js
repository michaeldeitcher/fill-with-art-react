import React, { useState } from 'react';
import ImageCanvas from './ImageCanvas'
import ApiClient from '../utility/ApiClient'
import axios from 'axios';
import {Redirect} from "react-router-dom";

export default function CreateBundleForm(props) {
  // Declare a new state variable, which we'll call "count"
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [imageBlob, setImageBlob] = useState('');
  const [imageError, setImageError] = useState('');
  const [pending, setPending] = useState(false);
  const [previewImgSrc, setPreviewImgSrc] = useState('');
  const [bundleCreated, setBundleCreated] = useState(false);

  const handleError = ( response ) => {
    const data = response.data;
    setTitleError('');
    setImageError('');
    console.log(data.errors);
    if(data.errors.length) {
        data.errors.forEach( (error) => {
        if(error.source.pointer === "/data/attributes/title")
            setTitleError( error.detail );
        if(error.source.pointer === "/data/attributes/image")
            setImageError( error.detail );
        })
    }
  }

  const handleSuccess = ( response ) => {
      console.log( response );
      setBundleCreated(response.data.data);
  }

  const onFormSubmit = (event) => {
    event.preventDefault();
    if(!imageBlob) {
        alert('Please select an image');
        return;
    }

    setPending(true);

    const authorization_token = `Token token=${props.user.authentication_token}, email=${props.user.email}`;

    const formData = new FormData();
    formData.set("bundle[title]", title);
    formData.append('bundle[image]', imageBlob, 'filename.png');      
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: authorization_token            
        }
    }
    axios.post( ApiClient.apiRoot + '/bundles', formData, config).then( (response) => {
        if( response.status === 201 )
          handleSuccess(response);
      })
      .catch(function (error) {
        if( error.response.status === 422 )
          handleError(error.response);
        else 
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
  }

  return (
    <div className='bundle bundle-create'>
        <ImageCanvas image={previewImgSrc} onImageBlob={onImageBlob}/>
        <form onSubmit={(e) => onFormSubmit(e)}>
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value) }/>
            { titleError.length > 0  && <div className='error-message'>{ titleError }</div> }
            <input type="file" onChange={(e) => showImagePreview(e.target.files[0])} />
            { imageError.length > 0  && <div className='error-message'>{ imageError }</div> }
            <input type="submit" className="submit" value={pending ? "Creating" : "Create Bundle"} />
        </form>
        {bundleCreated && 
            <Redirect
                to={{
                    pathname: `/bundle/${bundleCreated.attributes.friendly_id}`,
                    state: {bundle: bundleCreated}
                }}
            />        
        }
    </div>
  );
}