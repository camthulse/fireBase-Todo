"use strict";

var auth = firebase.auth();
var loggedIn = document.getElementById("loggedIn");
var loggedOut = document.getElementById("loggedOut");
var logInBtn = document.getElementById("button-logIn");
var logOutBtn = document.getElementById("button-logOut");
var userDetails = document.getElementById("userDetails");
var provider = new firebase.auth.GoogleAuthProvider();

logInBtn.onclick = function () {
  return auth.signInWithPopup(provider);
};

logOutBtn.onclick = function () {
  return auth.signOut();
};

var db = firebase.firestore();
var todoList = document.getElementById("todoList");
var todoInput = document.getElementById("todoInput");
var todoAddBtn = document.getElementById("todoAddBtn");
var todoListRef;
var unsubscribe;
auth.onAuthStateChanged(function (user) {
  if (user) {
    loggedIn.hidden = false;
    loggedOut.hidden = true;
    userDetails.innerHTML = "\n            <h1><span>User Name:</span> ".concat(user.displayName, "</h1>\n            <h1><span>E-Mail:</span> ").concat(user.email, "</h1>\n        ");
    todoListRef = db.collection('todos');

    todoAddBtn.onclick = function () {
      if (todoInput.value == '') {
        console.log("Error, input field empty.");
      } else {
        todoListRef.add({
          uid: user.uid,
          todo: todoInput.value,
          completed: false
        });
      }

      todoInput.value = '';
    };

    unsubscribe = todoListRef.where('uid', '==', user.uid).onSnapshot(function (querySnapshot) {
      var items = querySnapshot.docs.map(function (doc) {
        return "<li class=\"list-group-item\" id=\"".concat(doc.id, "\"><span>").concat(doc.data().todo, "</span><button class=\"btn btn-danger\" id=\"deleteTodo\" onclick=deleteTodo(this)>X</button></li>");
      });
      todoList.innerHTML = items.join('');
    });
  } else {
    unsubscribe && unsubscribe();
    loggedIn.hidden = true;
    loggedOut.hidden = false;
    userDetails.innerHTML = '';
  }
});

function deleteTodo(el) {
  var db = firebase.firestore();
  var doce = db.collection('todos').doc(el.parentNode.id);
  doce["delete"]();
}