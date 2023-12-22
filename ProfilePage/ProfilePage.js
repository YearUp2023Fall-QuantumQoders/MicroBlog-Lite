"use strict"

const sendMessage = document.getElementById("send-message");
const messageText = document.getElementById("message-text");
const posts = document.getElementById("posts")
const loginData = JSON.parse(window.localStorage.getItem("login-data"));

window.onload = () =>{
    displayPosts();
    sendMessage.onclick = sendPost;
}   

// send a post fetch to create a post
const sendPost = () =>{
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${loginData.token}`,    
            },
            body: JSON.stringify({
                text: messageText.value
            }),
        }
    )
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            window.location.reload();
        })
        .catch(err => console.log(err));
}


// display all the post user liked or created 
const displayPosts = () =>{
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${loginData.token}`,    
            }
        })
        .then(res => res.json())
        .then(data =>{
            // console.log(data);
            addPostsToDiv(data)
        });
    
}


const addPostsToDiv = (Posts) =>{
    for(let singlePost of Posts){
        // display post if user created it
        if(singlePost.username == loginData.username){
            formatSinglePost(singlePost);
        } else{
            // loop through likes of every post and find which one user liked
            if(singlePost.likes.length > 0){
                for(let likedUser of singlePost.likes){
                    if(likedUser.username == loginData.username){
                        formatSinglePost(singlePost);
                    }
                }
            }
        }
    }
}


// format the layout of a single post
const formatSinglePost = (post) => {
    // use same layout as Posts Page 
    console.log(post);
};
