"use strict"

const sendMessage = document.getElementById("send-message");
const messageText = document.getElementById("message-text");

window.onload = () =>{
    sendMessage.onclick = sendPost;

}


const sendPost = () =>{
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({
                text: messageText.value
            }),
        }
    )
        .then(res => res.json())
        .then(data =>{
            console.log(data);
        })
        .catch(err => console.log(err));
}