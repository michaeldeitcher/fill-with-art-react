import React, { useState, useEffect, useRef } from 'react';

export default function ImageCanvas(props) {
    const canvasRef = useRef();
    const imgRef = useRef();

    const [width, setWidth] = useState(850);
    const [height, setHeight] = useState(1100);

    const adjustCanvasSize = () => {
        const ratio = 85/110;
        const margin = 20;
        const maxWidth = window.innerWidth - margin;
        const maxHeight = window.innerHeight - margin;
        if( maxWidth < width ) {
            setWidth(maxWidth);
            setHeight(ratio/maxWidth);
        }
        if( maxHeight < height ) {
            setHeight(maxHeight);
            setWidth(ratio*maxHeight);
        }
    }

    useEffect( () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = imgRef.current;

        img.onload = () => {
            // draw image center filling canvas at the same aspect ratio as image
            const imgRatio = img.width / img.height;
            if( img.height < height ) {
                let drawWidth = height * imgRatio;
                ctx.drawImage(img, -(drawWidth-width)/2, 0, drawWidth, height);    
            } else {
                ctx.drawImage(img, 0, -(img.height - height)/2, width, img.height);    
            }
            canvas.toBlob( blob => props.onImageBlob(blob));
        }
        adjustCanvasSize();    
    }, []);

    return (
      <div>
        <canvas ref={canvasRef} width={width} height={height} />
        <img ref={imgRef} src={props.image} className="hidden" width={width} alt=''/>
      </div>
    )
}