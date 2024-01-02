"use strict"

const sendMessage = document.getElementById("send-message");
const messageText = document.getElementById("message-text");
const cardContainer = document.getElementById("posts")
const loginData = JSON.parse(window.localStorage.getItem("login-data"));
const displayBioOnPage = document.getElementById("display-bio");
const passwordInput = document.getElementById("password-input");
const bioInput = document.getElementById("message-text-bio");
const sendBioMessage = document.getElementById("send-message-bio");
const fullNameInput = document.getElementById("fullName-input");
const userName = document.getElementById("user-name");


window.onload = () =>{
    // remove the old values inside both Modals 
    passwordInput.value = "";
    bioInput.value = "";
    messageText.value = "";
    fullNameInput.value = "";

    displayBio();
    let logoutLink = document.getElementById("navLogout");
    logoutLink.onclick = logout;
    displayPosts();
    sendMessage.onclick = sendPost;
    sendBioMessage.onclick = updateBio;
}   

// display Bio of User
const displayBio = () =>{
    fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${loginData.username}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${loginData.token}`,    
            }
        })
        .then(res => res.json())
        .then(data =>{
            sessionStorage.setItem("userInfo", JSON.stringify(data));
            userName.innerText = data.fullName;
            if(data.bio){
                displayBioOnPage.innerText = data.bio;
            } else{
                displayBioOnPage.innerText = "This user has not provided a bio yet.";
            }
            
        });
}

// update the User's Bio
const updateBio = () => {
    
    let bodyObject = {
        password: passwordInput.value, 
        bio: bioInput.value,
        fullName: fullNameInput.value
    }
    console.log(bodyObject);
    fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/users/${loginData.username}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${loginData.token}`,    
            "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyObject)
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            userName.innerText = data.fullName;
            window.location.reload();
        })
        .catch(err => console.log(err));


}

// send a post fetch to create a post
const sendPost = () =>{
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${loginData.token} `,    
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
const formatSinglePost = (userPost) => {
    // use same layout as Posts Page 
    let postUsername = userPost.username;
    let postTimestamp = userPost.createdAt;
    let postText = userPost.text;

    let postDate = postTimestamp.substr(0, postTimestamp.indexOf('T'));
    let postTime = postTimestamp.substring(postTimestamp.indexOf('T') + 1, postTimestamp.indexOf('.'));

    //create a new card every time there's a new post
    let card = document.createElement('div');
    card.className = 'card';

    //card body
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    //add body content
    cardBody.innerHTML = `<h5 class="card-title">${postUsername}</h5>` +
        `<h6 class="card-subtitle mb-2 text-body-secondary">${postDate}, ${postTime}</h6>` +
        `<p class="card-text">${postText}</p>`;

    //Append card body to card
    card.appendChild(cardBody);

    //Append card to container
    cardContainer.appendChild(card);
};
