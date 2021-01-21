
let loggedUser = 2; // assumir que o utilizador autenticado é o este id
window.onload = function() {
    notifButton(loggedUser);
}

function show(index) {
    switch (index) {
        case 0:
            window.location = "../index.html";
            break;
        case 1:
            window.location = "team.html";
            break;
        case 2:
            window.location = "event.html";
            break;
        case 3:
            window.location = "map.html";
            break;
    }
}