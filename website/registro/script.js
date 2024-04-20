const xhr = new XMLHttpRequest();
xhr.open("POST", "127.0.0.1");
xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

const body = JSON.stringify({
    nombre: document.getElementById("name").value,
    nombre: document.getElementById("apellido").value,
    nombre: document.getElementById("email").value,
    nombre: document.getElementById("password").value,
    nombre: document.getElementById("novedades").value,
    nombre: document.getElementById("referal-label").value,
});

xhr.send(body)