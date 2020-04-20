const image2base64 = require('image-to-base64');
image2base64("C:\\Users\\paras_czzmheb.DESKTOP-0J63I7V\\Downloads\\Reserved-removebg-preview.png") // you can also to use url
    .then(
        (response) => {
            console.log(response); //cGF0aC90by9maWxlLmpwZw==
        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )