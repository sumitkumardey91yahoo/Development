console.log("i am here");

import('./index.js').then((res) => {
    console.log(res)
}, (error) => {
    console.log(error)
})

