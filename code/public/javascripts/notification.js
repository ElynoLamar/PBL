async function notifButton(player) {
    var notif = await getPlayersNotif(player);
    var notifCount = await getNotifCount(player);
    let block = "";
    block += "<div class='dropdown'>";
    block += "<span class='badge'>" + notifCount.num + "</span><div class='dropdown-content' id='notif-content'>";
    for (let i = 0; i < notif.length; i++) {
        block += "<a>" + notif[i].text_notif;
        if (notif[i].invite == 1) {
            if (Number.isInteger(notif[i].teamInv)) {
                block += "<span class='flex-notif-container'><div class='accept' onclick=changeStatus(" + notif[i].id_notif + "," + 2 + "," + notif[i].teamInv + "," + notif[i].receiver + ")>✔</div><div class='deny' onclick=changeStatus(" + notif[i].id_notif + "," + 3 + "," + notif[i].teamInv + "," + notif[i].receiver + ")>✖</div></span>";
            } else if (Number.isInteger(notif[i].eventInv)) {
                block += "<span class='flex-notif-container'><div class='accept' onclick=changeStatus(" + notif[i].id_notif + "," + 2 + "," + notif[i].eventInv + "," + notif[i].receiver + ")>✔</div><div class='deny' onclick=changeStatus(" + notif[i].id_notif + "," + 3 + "," + notif[i].eventInv + "," + notif[i].receiver + ")>✖</div></span>";

            }
        } else if (notif[i].invite == 0) {
            if (Number.isInteger(notif[i].teamInv)) {
                block += "<span class='flex-notif-container'><div class='accept' onclick=changeStatus(" + notif[i].id_notif + "," + 2 + "," + notif[i].teamInv + "," + notif[i].sender + ")>✔</div><div class='deny' onclick=changeStatus(" + notif[i].id_notif + "," + 3 + "," + notif[i].teamInv + "," + notif[i].receiver + ")>✖</div></span>";
            } else {
                // entrar em evento
            }
        }

        block += "</a>";
    }
    block += "</div>";
    block += "</div>";
    document.getElementById("badgeContainer").innerHTML = block;
    toggleNotif();
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

async function changeStatus(idNotif, newstatus, teamORevent, player) {
    let notification = await getSpecificNotification(idNotif);
    if (notification.teamInv != null) {
        console.log("entrei na team");
        try {
            let updatedInv = {
                id: idNotif,
                status: newstatus
            }
            let result = await $.ajax({
                url: "/api/notifications/",
                method: "post",
                dataType: "json",
                data: JSON.stringify(updatedInv),
                contentType: "application/json"
            });
            if (newstatus == 2) {
                joinTeam(teamORevent, player);
            }
            notifButton(player);
        } catch (err) {
            console.log(err);
        }
    } else if (notification.eventInv != null) {
        try {
            let updatedInv = {
                id: idNotif,
                status: newstatus
            }
            let result = await $.ajax({
                url: "/api/notifications/",
                method: "post",
                dataType: "json",
                data: JSON.stringify(updatedInv),
                contentType: "application/json"
            });
            if (newstatus == 2) {
                alert("HEY");
            }
            notifButton(player);
        } catch (err) {
            console.log(err);
        }
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