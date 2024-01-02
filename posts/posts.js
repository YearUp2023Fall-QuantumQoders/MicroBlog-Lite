/* Posts Page JavaScript */
"use strict";



let apiLink = "https://microbloglite.us-east-2.elasticbeanstalk.com";

let cardContainer = document.getElementById("displayPostsContainer");

window.onload = init();

function init() {
  loadPosts();
}

function loadPosts() {

  let loginData = getLoginData();
  let options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  fetch(apiLink + "/api/posts", options)
    .then(response => response.json())
    .then(userPosts => {
      createCard(userPosts);
    });

}


function createCard(userPost) {
  let postUsername = userPost.username;
  let postTimestamp = userPost.createdAt;
  let postText = userPost.text;

  //create a new card every time there's a new post
  let card = document.createElement('div');
  card.className = 'card';

  //card body
  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  //add body content
  cardBody.innerHTML = `<h5 class="card-title">${postUsername}</h5>` +
    `<h6 class="card-subtitle mb-2 text-body-secondary">${postTimestamp}</h6>` +
    `<p class="card-text">${postText}</p>`;

  //Append card body to card
  card.appendChild(cardBody);

  //Append card to container
  cardContainer.appendChild(card);
}

function getLoginData() {
  const loginJSON = window.localStorage.getItem("login-data");
  return JSON.parse(loginJSON) || {};
}

function isLoggedIn() {
  const loginData = getLoginData();
  return Boolean(loginData.token);
}