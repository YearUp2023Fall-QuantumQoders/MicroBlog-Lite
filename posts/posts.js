/* Posts Page JavaScript */
"use strict";



let loginData = getLoginData();
let options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${loginData.token}`,
    'Content-Type': 'application/json',
  },
};

let apiLink = "http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts";

let cardContainer = document.getElementById("displayPostsContainer");
let logoutLink = document.getElementById("navLogout");
let loggedUser = document.getElementById("loggedUser");
window.onload = init();

function init(){
  loggedUser.text = loginData.username;
  logoutLink.onclick = logout;
  loadPosts();
  
  deleteBtn.onclick=deleteAPost;

}

function loadPosts() {
  fetch(apiLink, options)
    .then(response => response.json())
    .then(userPosts => {
      for(let x = 0; x < userPosts.length; x++){
        createCard(userPosts[x]);
      }
      
    });

}

//Elements for Like and Delete Posts









function createCard(userPost) {
  let postUsername = userPost.username;
  let postTimestamp = userPost.createdAt;
  let postText = userPost.text;

  let postDate = postTimestamp.substr(0, postTimestamp.indexOf('T'));
  let postTime = postTimestamp.substring(postTimestamp.indexOf('T') + 1, postTimestamp.indexOf('.'));
 

  //create a new card every time there's a new post
  let card = document.createElement('div');
  card.className = 'card ';

  //card body
  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  //add body content
  cardBody.innerHTML = `<h5 class="card-title">${postUsername}</h5>` +
    `<h6 class="card-subtitle mb-2 text-body-secondary">${postDate}, ${postTime}</h6>` +
    `<p class="card-text">${postText}</p>` +  `<p id='displayLikes_${userPost._id}'> Likes: ${userPost.likes.length}</p>` + `<button id="likeBtn_${userPost._id}" class="offset-11 col-.1"> <img id="heartIcon" src="images/heart.png"> Like </button>` 
    + `<button id="deleteBtn" class="offset-11 col-.1"> Delete </button>`;

console.log(userPost.likes.length)

  //Append card body to card
  card.appendChild(cardBody);

  //Append card to container
  cardContainer.appendChild(card);

  const likeBtn= document.getElementById(`likeBtn_${userPost._id}`)
  const displayLikes= document.getElementById(`displayLikes_${userPost._id}`)
  likeBtn.onclick= function (){
    addALike(userPost._id, userPost,displayLikes);
  }
 
}



function addALike(postId,userPost,displayLikes) {
  fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/likes`, {
    method: "POST",
    body: JSON.stringify({
      postId: postId
    }),
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      "Authorization": `Bearer ${loginData.token}`
    }
  })
  .then(response => response.json())
  .then(json => {
    console.log(userPost.likes.length)
    displayLikes.innerHTML=`Likes: ${userPost.likes.length + 1}`;
   
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    // Handle the error appropriately
  });
}

    




function getLoginData() {
  console.log("getLoginData");
  const loginJSON = window.localStorage.getItem("login-data");
  console.log(loginJSON);
  console.log(JSON.parse(loginJSON));

  return JSON.parse(loginJSON) || {};
}

function isLoggedIn() {
  const loginData = getLoginData();
  return Boolean(loginData.token);
}