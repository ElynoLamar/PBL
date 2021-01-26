var loggedUser;
var x = document.getElementById("canvas");
window.onload = function() {
    loggedUser = sessionStorage.getItem("loggedUser");
    alert(loggedUser);
    //notifButton(loggedUser);
    createPaint(x);
    createNewEventForm();
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


function elt(name, attributes) {
    var node = document.createElement(name);
    if (attributes) {
        for (var attr in attributes)
            if (attributes.hasOwnProperty(attr))
                node.setAttribute(attr, attributes[attr]);
    }
    for (var i = 2; i < arguments.length; i++) {
        var child = arguments[i];
        if (typeof child == "string")
            child = document.createTextNode(child);
        node.appendChild(child);
    }
    return node;
}

var controls = Object.create(null);

function createPaint(parent) {
    var canvas = elt("canvas", { width: 1000, height: 500 });
    var cx = canvas.getContext("2d");
    var toolbar = elt("div", { class: "toolbar" });
    for (var name in controls)
        toolbar.appendChild(controls[name](cx));

    var panel = elt("div", { class: "picturepanel" }, canvas);
    parent.appendChild(elt("div", null, panel, toolbar));

}

var tools = Object.create(null);

controls.tool = function(cx) {
    var select = elt("select");
    for (var name in tools)
        select.appendChild(elt("option", null, name));

    cx.canvas.addEventListener("mousedown", function(event) {
        if (event.which == 1) {
            tools[select.value](event, cx);
            event.preventDefault();
        }
    });

    return elt("span", null, "Tool: ", select);
};

function relativePos(event, element) {
    var rect = element.getBoundingClientRect();
    return {
        x: Math.floor(event.clientX - rect.left),
        y: Math.floor(event.clientY - rect.top)
    };
}

function trackDrag(onMove, onEnd) {
    function end(event) {
        removeEventListener("mousemove", onMove);
        removeEventListener("mouseup", end);
        if (onEnd)
            onEnd(event);
    }
    addEventListener("mousemove", onMove);
    addEventListener("mouseup", end);
}

tools.Line = function(event, cx, onEnd) {
    cx.lineCap = "round";

    var pos = relativePos(event, cx.canvas);
    trackDrag(function(event) {
        cx.beginPath();
        cx.moveTo(pos.x, pos.y);
        pos = relativePos(event, cx.canvas);
        cx.lineTo(pos.x, pos.y);
        cx.stroke();
    }, onEnd);
};
tools.Erase = function(event, cx) {
    cx.globalCompositeOperation = "destination-out";
    tools.Line(event, cx, function() {
        cx.globalCompositeOperation = "source-over";
    });
};

controls.color = function(cx) {
    var input = elt("input", { type: "color" });
    input.addEventListener("change", function() {
        cx.fillStyle = input.value;
        cx.strokeStyle = input.value;
    });
    return elt("span", null, "Color: ", input);
};

controls.brushSize = function(cx) {
    var select = elt("select");
    var sizes = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];
    sizes.forEach(function(size) {
        select.appendChild(elt("option", { value: size },
            size + " pixels"));
    });
    select.addEventListener("change", function() {
        cx.lineWidth = select.value;
    });
    return elt("span", null, "Brush size: ", select);
};

controls.save = function(cx) {
    var link = elt("button", { type: "submit" }, "Create Tactic");


    function ahahaha() {
        createTact(cx.canvas.toDataURL());
    }

    function update() {
        try {
            link.href = cx.canvas.toDataURL();
        } catch (e) {
            if (e instanceof SecurityError)
                link.href = "javascript:alert(" +
                JSON.stringify("Can't save: " + e.toString()) + ")";
            else
                throw e;
        }
    }
    link.addEventListener("mouseover", update);
    link.addEventListener("focus", update);
    link.addEventListener("click", ahahaha);
    return link;
};

function loadImageURL(cx, url) {
    var image = document.createElement("img");
    image.addEventListener("load", function() {

        var color = cx.fillStyle,
            size = cx.lineWidth;
        /**
                        cx.canvas.width = image.width;
                    cx.canvas.height = image.height;
        */
        cx.canvas.width = '1000';
        cx.canvas.height = '500';
        cx.drawImage(image, 0, 0, 1000, 500);
        cx.fillStyle = color;
        cx.strokeStyle = color;
        cx.lineWidth = size;
    });
    image.src = url;
}

controls.openFile = function(cx) {
    var input = elt("input", { type: "file" });
    input.addEventListener("change", function() {
        if (input.files.length == 0) return;
        var reader = new FileReader();
        reader.addEventListener("load", function() {
            loadImageURL(cx, reader.result);
        });
        reader.readAsDataURL(input.files[0]);
    });
    return elt("div", null, "Open file: ", input);
};
controls.openURL = function(cx) {
    var input = elt("input", { type: "text" });
    var form = elt("form", null,
        "Open URL: ", input,
        elt("button", { type: "submit" }, "load"));
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        loadImageURL(cx, input.value);
    });
    return form;
};
tools.Text = function(event, cx) {
    var text = prompt("Text:", "");
    if (text) {
        var pos = relativePos(event, cx.canvas);
        cx.font = Math.max(7, cx.lineWidth) + "px sans-serif";
        cx.fillText(text, pos.x, pos.y);
    }
};
tools.Spray = function(event, cx) {
    var radius = cx.lineWidth / 2;
    var area = radius * radius * Math.PI;
    var dotsPerTick = Math.ceil(area / 30);

    var currentPos = relativePos(event, cx.canvas);
    var spray = setInterval(function() {
        for (var i = 0; i < dotsPerTick; i++) {
            var offset = randomPointInRadius(radius);
            cx.fillRect(currentPos.x + offset.x,
                currentPos.y + offset.y, 1, 1);
        }
    }, 25);
    trackDrag(function(event) {
        currentPos = relativePos(event, cx.canvas);
    }, function() {
        clearInterval(spray);
    });
};

function randomPointInRadius(radius) {
    for (;;) {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        if (x * x + y * y <= 1)
            return { x: x * radius, y: y * radius };
    }
}

async function getTeamsAndGroups(id) {
    try {
        var leads = await $.ajax({
            url: "/api/players/" + id + "/leaderships",
            method: "get",
            dataType: "json"
        });
        return leads;
    } catch (err) {
        console.log(err);
    }
}
async function getAllDistinctFields() {
    try {
        var fields = await $.ajax({
            url: "/api/fields/distinct",
            method: "get",
            dataType: "json"
        });
        return fields;
    } catch (err) {
        console.log(err);
    }
}

async function createNewEventForm() {
    var leads = await getTeamsAndGroups(loggedUser);
    var fields = await getAllDistinctFields();
    block = "";
    block += "<h1>Create Tactic:</h1>";
    block += "<form class='form-container'>";
    block += " <label><b>Tactic name</b></label><br>";
    block += "<input type='text' placeholder='Enter your Tactic Name' id='ctactName' required><br><br>";
    block += " <label><b>Save for:  </b>(select your team or group)</label><br>";
    block += "<select id='teamsGroups' name='teamsGroups'>";
    for (let i = 0; i < leads.length; i++) {
        block += "<option value=" + leads[i].id + "> TEAM: " + leads[i].name + "</option>";
    }
    block += "</select><br><br>";
    block += " <label><b>Select field:  </b>(select the field this image represents)</label><br>";
    block += "<select id='fields' name='fields'>";
    for (let i = 0; i < fields.length; i++) {
        block += "<option value=" + fields[i].id + ">" + fields[i].name + "</option>";
    }
    document.getElementById("tactCreation").innerHTML = block;
}


async function createTact(image) {

    try {
        let tactic = {
            name: document.getElementById("ctactName").value,
            team_or_group: document.getElementById("teamsGroups").value,
            field: document.getElementById("fields").value,
            player: loggedUser, // not used, just incase we wanna keep track of who created
            image_path: image
        }
        console.log(JSON.stringify(tactic));
        let result = await $.ajax({
            url: "/api/tactics/",
            method: "post",
            dataType: "json",
            data: JSON.stringify(tactic),
            contentType: "application/json"
        });
        console.log(JSON.stringify(tactic));
    } catch (err) {
        console.log(err);
    }
}