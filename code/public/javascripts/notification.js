async function notifButton(player) {
    var notif = await getPlayersNotif(player);
    console.log(JSON.stringify(notif));
    var notifCount = await getNotifCount(player);
    let block = "";
    block += "<div class='dropdown'>";
    block += "<span class='badge'>" + notifCount.num + "</span><div class='dropdown-content' id='notif-content'>";
    for (let i = 0; i < notif.length; i++) {
        block += "<a>" + notif[i].text_notif;
        if (notif[i].invite == 1) {
            if (Number.isInteger(notif[i].eventInv)) {
                if (Number.isInteger(notif[i].teamInv)) {
                    block += "<div class='flex-notif-container'><span class='accept' onclick=changeStatus(" + notif[i].id_notif + "," + 2 + "," + notif[i].eventInv + "," + notif[i].receiver + "," + 0 + ")>✔</span><span class='deny' onclick=changeStatus(" + notif[i].id_notif + "," + 3 + "," + notif[i].eventInv + "," + notif[i].receiver + "," + 0 + ")>✖</span></div>";
                } else {
                    alert("supostamente OBJ ir com team")
                        //     block += "<div class='flex-notif-container'><span class='accept' onclick=changeStatus(" + notif[i].id_notif + "," + 2 + "," + notif[i].eventInv + "." + notif[i].teamInv + "," + notif[i].receiver + "," + 1 + ")>✔</span><span class='deny' onclick=changeStatus(" + notif[i].id_notif + "," + 3 + "," + notif[i].eventInv + "," + notif[i].receiver + "," + 1 + ")>✖</span></div>";
                }
            } else if (Number.isInteger(notif[i].teamInv)) {
                block += "<div class='flex-notif-container'><span class='accept' onclick=changeStatus(" + notif[i].id_notif + "," + 2 + "," + notif[i].teamInv + "," + notif[i].receiver + "," + 0 + ")>✔</span><span class='deny' onclick=changeStatus(" + notif[i].id_notif + "," + 3 + "," + notif[i].teamInv + "," + notif[i].receiver + "," + 0 + ")>✖</span></div>";
            }

        } else if (notif[i].invite == 0) {
            if (Number.isInteger(notif[i].teamInv)) {
                block += "<div class='flex-notif-container'><span class='accept' onclick=changeStatus(" + notif[i].id_notif + "," + 2 + "," + notif[i].teamInv + "," + notif[i].sender + "," + 0 + ")>✔</span><span class='deny' onclick=changeStatus(" + notif[i].id_notif + "," + 3 + "," + notif[i].teamInv + "," + notif[i].sender + "," + 0 + ")>✖</span></div>";
            } else if (Number.isInteger(notif[i].eventInv)) {
                block += "<div class='flex-notif-container'><span class='accept' onclick=changeStatus(" + notif[i].id_notif + "," + 2 + "," + notif[i].eventInv + "," + notif[i].sender + "," + 0 + ")>✔</span><span class='deny' onclick=changeStatus(" + notif[i].id_notif + "," + 3 + "," + notif[i].eventInv + "," + notif[i].sender + "," + 0 + ")>✖</span></div>";
            }
        }
        block += "</a>";
    }
    block += "</div>";
    block += "</div>";
    document.getElementById("badgeContainer").innerHTML = block;
    toggleNotif();

}


async function changeStatus(idNotif, newstatus, teamORevent, player, wholeteam) {

    let notification = await getSpecificNotification(idNotif);
    try {
        let updatedInv = {}
        if (wholeteam == 1) { //not implemented, mas seria para saber qual a equipa do jogador quando se convida uma equipa inteira para um evento
            let eVorT = teamORevent; //pode ser id evento ou id team, esta no formato eventID.teamID
            let eeVorT = eVorT.substring(0, 1) //buscar o eventID
            partsOfStr = eVorT.split('.'); //dividir a string em partes de array
            let teVorT = partsOfStr[1]; // teamID é a segunda parte do array
            updatedInv = {
                id: idNotif,
                status: newstatus,
                target: eeVorT,
                target2: teVorT,
                newmember: player,
                isTeam: false
            }
            notifButton(notification.receiver);
        } else if (wholeteam == 0) {
            if (notification.eventInv != null) {

                updatedInv = {
                    id: idNotif,
                    status: newstatus,
                    target: teamORevent,
                    newmember: player,
                    isTeam: false
                }

                notifButton(notification.receiver);
            } else if (notification.teamInv != null) {
                updatedInv = {
                    id: idNotif,
                    status: newstatus,
                    target: teamORevent,
                    newmember: player,
                    isTeam: true
                }
                notifButton(player);
            } else {
                updatedInv = {
                    id: idNotif,
                    status: newstatus
                }
                notifButton(player);
            }
        }
        let result = await $.ajax({
            url: "/api/notifications/",
            method: "post",
            dataType: "json",
            data: JSON.stringify(updatedInv),
            contentType: "application/json"
        });
    } catch (err) {
        console.log(err);
    }
    location.reload();
}




function toggleNotif() {
    let x = document.getElementById("notif-content");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

async function getPlayersNotif(player) {

    try {
        var getmyNotif = await $.ajax({
            url: "/api/notifications/player/" + player,
            method: "get",
            dataType: "json"
        });

        return getmyNotif;
    } catch (err) {
        console.log(err);
    }
}

async function getSpecificNotification(notifID) {

    try {
        var getSpecificNotif = await $.ajax({
            url: "/api/notifications/" + notifID,
            method: "get",
            dataType: "json"
        });

        return getSpecificNotif;
    } catch (err) {
        console.log(err);
    }
}



async function getNotifCount(player) {
    try {
        var notifCount = await $.ajax({
            url: "/api/notifications/player/" + player + "/count",
            method: "get",
            dataType: "json"
        });
        return notifCount;
    } catch (err) {
        console.log(err);
    }
}


async function joinEvent(eventID, playerID) {
    try {
        let newMember = {
            player: playerID,
            event: eventID,
            ranking: 2
        }

        let result = await $.ajax({
            url: "/api/events/newmember",
            method: "put",
            dataType: "json",
            data: JSON.stringify(newMember),
            contentType: "application/json"
        });

    } catch (err) {
        console.log(err);
    }
    closeMiddleBox();
}

async function joinTeam(teamID, playerID) {
    try {
        let newMember = {
            player: playerID,
            ranking: 2,
            role: 1
        }

        let result = await $.ajax({
            url: "/api/teams/" + teamID + "/newmember",
            method: "post",
            dataType: "json",
            data: JSON.stringify(newMember),
            contentType: "application/json"
        });
    } catch (err) {
        console.log(err);
    }
    closeMiddleBox();

}