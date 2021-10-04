const validate = (inputid, toastid) => {
    const name = document.getElementById(inputid).value;
    if(name.length ==0 ){
        document.getElementById(inputid).focus();
        document.getElementById(toastid+'Inside').innerHTML = "Display Name/ Room Name must not be empty";
        $("#"+toastid).toast("show");
        return false;
    }
    return true;
}
const validatePassword = (inputid, toastid) => {
    const password = document.getElementById(inputid).value;
    if(password.length < 8 ){
        document.getElementById(inputid).focus();
        document.getElementById(toastid+'Inside').innerHTML = "Password must be 8 characters long.";
        $("#"+toastid).toast("show");
        return false;
    }
    return true;
}
const validatePasswordC = (inputid1, inputid2, toastid) => {
    const password = document.getElementById(inputid1).value;
    const confirmPassword = document.getElementById(inputid2).value;
    if(password.length < 8 ){
        document.getElementById(inputid1).focus();
        document.getElementById(toastid+'Inside').innerHTML = "Password must be 8 characters long.";
        $("#"+toastid).toast("show");
        return false;
    }
    else if(password!==confirmPassword){
        document.getElementById(inputid2).focus();
        document.getElementById(toastid+'Inside').innerHTML = "Confrim Password and Password Must be same!";
        $("#"+toastid).toast("show");
        return false;
    }
    return true;
}

$("#displayName").on("blur", ()=>{
    validate("displayName","joinToast");
});
$("#roomName").on("blur", ()=>{
    validate("roomName","joinToast");
});
$("#password").on("blur", ()=>{
    validatePassword("password","joinToast");
});
const joinRoomBtn = () => {
    const name = document.getElementById("displayName").value;
    const room = document.getElementById("roomName").value.toLowerCase();
    const password = document.getElementById("password").value;
    let valid = validate("displayName", "joinToast")
    if(valid){
        valid = validate("roomName", "joinToast")
    }
    if(valid){
        valid = validatePassword("password", "joinToast")
    }
    if(valid){
        let status;
        fetch("https://wacloneapi.herokuapp.com/joinRoom", {
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
                $("#joinToastInside").html(result.message);
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
$("#displayNameC").on("blur", ()=>{
    validate("displayNameC","createToast");
});
$("#roomNameC").on("blur", ()=>{
    validate("roomNameC","createToast");
});
$("#passwordC").on("blur", ()=>{
    validatePassword("passwordC","createToast");
});
$("#confirmPassowrd").on("blur", ()=>{
    validatePasswordC("passwordC","confirmPassowrd","createToast");
});
const createRoom = () => {
    const name = document.getElementById("displayNameC").value;
    const room = document.getElementById("roomNameC").value.toLowerCase();
    const password = document.getElementById("passwordC").value;
    let valid = validate("displayNameC", "createToast")
    if(valid){
        valid = validate("roomNameC", "createToast")
    }
    if(valid){
        valid = validatePasswordC("passwordC", "confirmPassowrd", "createToast")
    }
    if(valid){
        let status;
        fetch("https://wacloneapi.herokuapp.com/createRoom", {
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
                $("#createToastInside").html(result.message);
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
document.getElementById("password").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("join").click();
    }
});
if(document.getElementById("roomName"))
document.getElementById("roomName").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("password").focus();
    }
});
if(document.getElementById("displayName"))
document.getElementById("displayName").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("roomName").focus();
    }
});
if(document.getElementById("displayNameC"))
document.getElementById("displayNameC").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("roomNameC").focus();
    }
});
if(document.getElementById("roomNameC"))
document.getElementById("roomNameC").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("passwordC").focus();
    }
});
if(document.getElementById("passwordC"))
document.getElementById("passwordC").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("confirmPassowrd").focus();
    }
});
if(document.getElementById("confirmPassowrd"))
document.getElementById("confirmPassowrd").addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("create").click();
    }
});




