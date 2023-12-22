'use strict'
const bioField = document.getElementById('aboutMe');
const fullNameField = document.getElementById('fullName');
const passwordField = document.getElementById('passwordInput');
const usernameField = document.getElementById('username');
const addUser = document.getElementById('addUser');


window.onload =init;

function init (){
  addUser.onclick = onaddUserFormClick ;
  
}


function onaddUserFormClick (){
    
    // let bodyData = {
    //   fullname: fullNameField.value,
    //   password:passwordField.value,
    //   username:usernameField.value,
    //   about:bioField.value
    //   };
    
      fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", {
        method: "POST",
        body: JSON.stringify({
          fullName: fullNameField.value,
          password:passwordField.value,
          username:usernameField.value,
          about:bioField.value
          }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      })
      .then(response => response.json())
      
      .then(json =>{
        console.log(json);
        // Handle the response data as needed
        window.location.replace('/landing/index.html');
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle the error appropriately
      });
    }
