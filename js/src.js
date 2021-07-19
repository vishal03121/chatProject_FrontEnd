
const validate = (name , inputid, toastid) => {
    if(name.length ==0 ){
        document.getElementById(inputid).focus();
        document.getElementById(toastid+'Inside').innerHTML = "Display Name/ Room Name must not be empty";
        $("#"+toastid).toast("show");
        return false;
    }
    return true;
}

const validatePassword = (password, inputid, toastid) => {
    if(password.length < 8 ){
        document.getElementById(inputid).focus();
        document.getElementById(toastid+'Inside').innerHTML = "Password must be 8 characters long.";
        $("#"+toastid).toast("show");
        return false;
    }
    return true;
}
const validatePasswordC = (password, confirmPassowrd, inputid1, inputid2, toastid) => {
    if(password.length < 8 ){
        document.getElementById(inputid1).focus();
        document.getElementById(toastid+'Inside').innerHTML = "Password must be 8 characters long.";
        $("#"+toastid).toast("show");
        return false;
    }
    else if(password!==confirmPassowrd){
        document.getElementById(inputid2).focus();
        document.getElementById(toastid+'Inside').innerHTML = "Confrim Password and Password Must be same!";
        $("#"+toastid).toast("show");
        return false;
    }
    return true;
}


const joinRoomBtn = () => {
    const name = document.getElementById("displayName").value;
    const room = document.getElementById("roomName").value.toLowerCase();
    const password = document.getElementById("password").value;
    let valid = validate(name, "displayName", "joinToast")
    if(valid){
        valid = validate(room, "roomName", "joinToast")
    }
    if(valid){
        valid = validatePassword(password, "password", "joinToast")
    }
    if(valid){
        let status;
        fetch("https://classifiedchat.herokuapp.com/joinRoom", {
        method: "PUT",
        body: JSON.stringify({
            room: room,
            username: name,
            password: password
        }),
        headers: {
            "Content-type": "application/json",
        },
        })
        .then((res) => {
            status = res.status;
            return res.json();
        })
        .then((result) => {
            if (status === 201) {
                location.replace(result.url);
            }
            else{
                $("#joinToast").html(result.message);
                $("#joinToast").toast("show");
            }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

const createRoom = () => {
    const name = document.getElementById("displayNameC").value;
    const room = document.getElementById("roomNameC").value.toLowerCase();
    const password = document.getElementById("passwordC").value;
    const confirmPassowrd = document.getElementById("confirmPassowrd").value;
    let valid = validate(name, "displayNameC", "createToast")
    if(valid){
        valid = validate(room, "roomNameC", "createToast")
    }
    if(valid){
        valid = validatePasswordC(password, confirmPassowrd, "passwordC", "confirmPassowrd", "createToast")
    }
    if(valid){
        let status;
        fetch("https://classifiedchat.herokuapp.com/createRoom", {
        method: "PUT",
        body: JSON.stringify({
            room: room,
            username: name,
            password: password
        }),
        headers: {
            "Content-type": "application/json",
        },
        })
        .then((res) => {
            status = res.status;
            return res.json();
        })
        .then((result) => {
            if (status === 201) {
                location.replace(result.url);
            }
            else{
                $("#createToast").html(result.message);
                $("#createToast").toast("show");
            }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

if(document.getElementById("password"))
document.getElementById("password").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("join").click();
    }
});
if(document.getElementById("roomName"))
document.getElementById("roomName").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("password").focus();
    }
});
if(document.getElementById("displayName"))
document.getElementById("displayName").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("roomName").focus();
    }
});
if(document.getElementById("displayNameC"))
document.getElementById("displayNameC").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("roomNameC").focus();
    }
});
if(document.getElementById("roomNameC"))
document.getElementById("roomNameC").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("passwordC").focus();
    }
});
if(document.getElementById("passwordC"))
document.getElementById("passwordC").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("confirmPassowrd").focus();
    }
});
if(document.getElementById("confirmPassowrd"))
document.getElementById("confirmPassowrd").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("create").click();
    }
});




