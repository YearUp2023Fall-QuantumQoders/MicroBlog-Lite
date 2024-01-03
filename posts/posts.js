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
let recentRadio = document.getElementById("recentRadio");
let nameRadio = document.getElementById("nameRadio");
let likedRadio = document.getElementById("likedRadio");
let usernameSearchBtn = document.getElementById("usernameSearchBtn");
window.onload = init();

function init(){
  loggedUser.text = loginData.username;
  logoutLink.onclick = logout;

  recentRadio.onchange = loadPosts;
  nameRadio.onchange = loadPosts;
  likedRadio.onchange = loadPosts;
  usernameSearchBtn.onclick = searchUserPosts;
  loadPosts();
}


//if trying to search via name, show text box. Otherwise, hide text box.
function namePromptVisibilityToggle(){
  namePrompt = document.getElementById("namePrompt");

  //RESET NAME FIELD WHEN CHANGING OPTIONS
  let nameField = document.getElementById("nameTextInput");
  nameField.value = "";

  if(nameRadio.checked){
    namePrompt.style = "display: visible;";
  }
  else if(!nameRadio.checked){
    namePrompt.style = "display: none;";
  }
}

//handles recent and most liked post sorts
function loadPosts() {
  //hide or show the username field
  namePromptVisibilityToggle();
  //reset post display
  cardContainer.innerHTML = "";

  if(recentRadio.checked){
    fetch(apiLink, options)
    .then(response => response.json())
    .then(userPosts => {
      for(let x = 0; x < userPosts.length; x++){
        createCard(userPosts[x]);
      }
    });
  }
  else if(likedRadio.checked){
    fetch(apiLink, options)
    .then(response => response.json())
    .then(userPosts => {
      userPosts.sort((a, b) => b.likes.length - a.likes.length);

      for(let x = 0; x < userPosts.length; x++){
          createCard(userPosts[x]);
      }
    });
  }
}

//handles posts sorted by input username (using .filter and .includes)
function searchUserPosts(){
  cardContainer.innerHTML = "";
  let nameTextInput = document.getElementById("nameTextInput").value.toLowerCase();

  fetch(apiLink, options)
    .then(response => response.json())
    .then(userPosts => {
      const filteredPosts = userPosts.filter((userPosts) => userPosts.username.toLowerCase().includes(nameTextInput));

      for(let x = 0; x < filteredPosts.length; x++){
        createCard(filteredPosts[x]);
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
    



  //Append card body to card
  card.appendChild(cardBody);

  //Append card to container
  cardContainer.appendChild(card);
// Like Btn Event Handler
  const likeBtn= document.getElementById(`likeBtn_${userPost._id}`)
  const displayLikes= document.getElementById(`displayLikes_${userPost._id}`)
  likeBtn.onclick= function (){
    addALike(userPost._id, userPost,displayLikes);
  }

  const login = JSON.parse(window.localStorage.getItem('login-data'))

  if(login.username == userPost.username){

  cardBody.innerHTML += `<button id="deleteBtn_${userPost._id}" class="offset-11 col-.1"> Delete </button>`;
  const deleteBtn =document.getElementById(`deleteBtn_${userPost._id}`)
  deleteBtn.onclick= function (){
    deleteAPost(userPost._id);
    }
    // console.log(deleteBtn)
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
   
    displayLikes.innerHTML=`Likes: ${userPost.likes.length + 1}`;
   
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    // Handle the error appropriately
  });
}

function deleteAPost(postId){

      fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${loginData.token}`
        }
        })
        .then(response => response.json()) 
        .then(json => {
          window.location.reload();
        })
        .catch(err => {
          console.log(err)
        });
    }




function getLoginData() {
  //console.log("getLoginData");
  const loginJSON = window.localStorage.getItem("login-data");
  //console.log(loginJSON);
  //console.log(JSON.parse(loginJSON));

  return JSON.parse(loginJSON) || {};
}

function isLoggedIn() {
  const loginData = getLoginData();
  return Boolean(loginData.token);
}