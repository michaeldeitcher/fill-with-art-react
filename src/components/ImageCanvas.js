import React, { useEffect, useRef } from 'react';

export default function ImageCanvas({imageSrc, onImageBlob}) {
    const canvasRef = useRef();

    const dpi = 300;
    const width = 8.5 * dpi;
    const height = 11 * dpi;

    useEffect( () => {
        if(!imageSrc)
            return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let img = new Image();        
        img.onload = () => {
            // draw image center filling canvas at the same aspect ratio as image
            const imgRatio = img.width / img.height;
            if(img.height > img.width){
                let drawHeight = width / imgRatio;
                ctx.drawImage(img, 0, -(drawHeight - height)/2, width, drawHeight); 
            } else {
                let drawWidth = height * imgRatio;
                ctx.drawImage(img, -(drawWidth - width)/2, 0, drawWidth, height);                 
            }
            canvas.toBlob( blob => onImageBlob(blob));
        }
        img.src = imageSrc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageSrc]); 

    return (
      <div>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    )
}