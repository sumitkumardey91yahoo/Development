// register sw file

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((res) => {
        console.log("sw register success");
    }, (error) => {
        console.log("failed");
    });
}