import React, { useEffect, useRef } from 'react'
import loadImage from 'blueimp-load-image' //for exif image orientation

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

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
        loadImage(
            imageSrc,
            function(img) {
                // draw image center filling canvas at the same aspect ratio as image
                const imgRatio = img.width / img.height;
                if(img.height > img.width){
                    let drawHeight = width / imgRatio;
                    ctx.drawImage(img, 0, -(drawHeight - height)/2, width, drawHeight); 
                } else {
                    let drawWidth = height * imgRatio;
                    ctx.drawImage(img, -(drawWidth - width)/2, 0, drawWidth, height);                 
                }

                var mediumQuality = canvas.toDataURL('image/jpeg', 0.5);
                onImageBlob(dataURLtoBlob(mediumQuality));
            },
            { orientation: true }
          );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageSrc]); 

    return (
      <div>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    )
}