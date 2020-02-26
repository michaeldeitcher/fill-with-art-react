import React, { useState } from 'react';
import ApiClient from '../utility/ApiClient'
import axios from 'axios';

export default function CreateBundleForm(props) {
  // Declare a new state variable, which we'll call "count"
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [imageError, setImageError] = useState('');
  const [pending, setPending] = useState(false);

  const onFormSubmit = (event) => {
    event.preventDefault();
    console.log(title);
    console.log(imageFile);
    setPending(true);

    const authorization_token = `Token token=${props.user.authentication_token}, email=${props.user.email}`;

    const formData = new FormData();
    formData.set("bundle[title]", title);
    formData.append("bundle[image]", imageFile);        
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: authorization_token            
        }
    }
    axios.post( ApiClient.apiRoot + '/bundles', formData, config).then( response => {
        console.log(response);
    })
  }

  return (
    <div>
        <form onSubmit={(e) => onFormSubmit(e)}>
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value) }/>
            { titleError.length > 0  && <div className='error-message'>{ titleError }</div> }
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            { imageError.length > 0  && <div className='error-message'>{ imageError }</div> }
            <input type="submit" className="submit" value={pending ? "Creating" : "Create Bundle"} />
        </form>
    </div>
  );
}