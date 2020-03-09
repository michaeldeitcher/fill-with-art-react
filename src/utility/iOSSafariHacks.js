const doNothing = event => event.preventDefault();
export function fixWindowScroll() {
    // keep iPhone from scroll from bouncing
    window.addEventListener('touchmove', doNothing, {passive: false})    
}

export function releaseWindowScroll() {
    window.removeEventListener('touchmove', doNothing);
}

