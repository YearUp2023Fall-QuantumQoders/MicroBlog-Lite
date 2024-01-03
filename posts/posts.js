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
window.onload = init();

function init(){
  logoutLink.onclick = logout;
  loadPosts();
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
    `<p class="card-text">${postText}</p>` + `<button class="offset-11 col-.1"> <img id="heartIcon" src="images/heart.png"> Like </button>`;



  //Append card body to card
  card.appendChild(cardBody);

  //Append card to container
  cardContainer.appendChild(card);
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