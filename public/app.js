const auth = firebase.auth();

const loggedIn = document.getElementById("loggedIn");
const loggedOut = document.getElementById("loggedOut");


const logInBtn = document.getElementById("button-logIn");
const logOutBtn = document.getElementById("button-logOut");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();


logInBtn.onclick = () => auth.signInWithPopup(provider);
logOutBtn.onclick = () => auth.signOut();


const db = firebase.firestore();

const todoList = document.getElementById("todoList");
const todoInput = document.getElementById("todoInput");
const todoAddBtn = document.getElementById("todoAddBtn");

let todoListRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if(user){
        loggedIn.hidden = false;
        loggedOut.hidden = true;
        userDetails.innerHTML = 
        `
            <h1>User Name: ${user.displayName}</h1>
            <h1>E-Mail: ${user.email}</h1>
        `;

        todoListRef = db.collection('todos');

        todoAddBtn.onclick = () => {
            if(todoInput.value == ''){
                console.log("Error, input field empty.");
            }else{
                todoListRef.add({
                    uid: user.uid,
                    todo: todoInput.value,
                    completed: false
                });
            }

            todoInput.value = '';
        }

        unsubscribe = todoListRef.where('uid', '==', user.uid).onSnapshot(querySnapshot => {
            const items = querySnapshot.docs.map(doc => {
                return `<li id="${doc.id}">${doc.data().todo} <button id="deleteTodo" onclick=deleteTodo(this)>X</button></li>`
            });
            
            todoList.innerHTML = items.join('');
        });
    }else{
        unsubscribe && unsubscribe();
        loggedIn.hidden = true;
        loggedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});


function deleteTodo(el){
    const db = firebase.firestore();
    const doce = db.collection('todos').doc(el.parentNode.id);
    doce.delete();
}