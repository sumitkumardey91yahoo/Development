console.log("start");
window.onscroll = function(ev) {
    lazyload();
}
function lazyload() {
    var lazyImage = document.getElementsByClassName('lazy');

    for (let i = 0; i < lazyImage.length; i++) {
        let rect = lazyImage[i].getBoundingClientRect();
        if(rect.top  <= (window.innerHeight)) {

            lazyImage[i].setAttribute('src',lazyImage[i].getAttribute('data-src'));
           }
    }
}

function lazyload() {
    // single image
    var lazyImage = document.getElementsByClassName('lazy1');

    for (let i = 0; i < lazyImage.length; i++) {
        let rect = lazyImage[i].getBoundingClientRect();
        console.log(rect.top + "--------" + window.innerHeight);
        if(rect.top  <= (window.innerHeight)) {

            lazyImage[i].setAttribute('src',lazyImage[i].getAttribute('data-src'));
           }
    }
}









