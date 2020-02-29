import React, { useState, useEffect, useRef } from 'react';

export default function ImageCanvas(props) {
    const canvasRef = useRef();
    const imgRef = useRef();

    const [width, setWidth] = useState(850);
    const [height, setHeight] = useState(1100);

    const adjustCanvasSize = () => {
        const ratio = 85/110;
        const margin = 100;
        const maxWidth = window.innerWidth - margin;
        const maxHeight = window.innerHeight - margin;
        if( maxWidth < maxHeight ) {
            setWidth(maxWidth);
            setHeight(Math.floor(maxWidth/ratio));
        } else  {
            setHeight(maxHeight);
            setWidth(Math.floor(maxHeight*ratio));
        }
    }

    useEffect( () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let img = new Image();        
        img.onload = () => {
            // draw image center filling canvas at the same aspect ratio as image
            console.log(img.height + ' ' + img.width);
            const imgRatio = img.width / img.height;
            if(img.height > img.width){
                let drawHeight = width / imgRatio;
                ctx.drawImage(img, 0, -(drawHeight - height)/2, width, drawHeight); 
            } else {
                let drawWidth = height * imgRatio;
                ctx.drawImage(img, -(drawWidth - width)/2, 0, drawWidth, height);                 
            }
            canvas.toBlob( blob => props.onImageBlob(blob));
        }
        img.src = props.image;
        adjustCanvasSize();    
    }, [props.image]);

    return (
      <div>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    )
}