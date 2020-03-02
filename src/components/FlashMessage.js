
import React, { useEffect, useState } from 'react';
import './FlashMessage.scss';

const emitFlashMessage = (message, type="info") => {
    var event = new CustomEvent("flash-message", {detail: {message: message, type: type}});
    document.querySelector(".flash-message").dispatchEvent(event);
}
export {emitFlashMessage};

export default () => {
    let [visibility, setVisibility] = useState(false);
    let [message, setMessage] = useState('');
    let [type, setType] = useState('');

    useEffect(() => {
        let elem = document.querySelector('.flash-message');
        elem.addEventListener('flash-message', (e) => {
            setVisibility(true);
            setMessage(e.detail.message);
            setType(e.detail.type);
            setTimeout(() => {
                setVisibility(false);
            }, 7000);
        });               
    }, []);

    return (
            <div className={`flash-message alert alert-${type} ${visibility ? 'show' : 'hide'}`}>
                <p>{message}</p>
            </div>
    )
}