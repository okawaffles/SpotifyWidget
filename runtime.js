let OAUTH_TOKEN = "";

function getStatus() {
    $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + OAUTH_TOKEN);
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("Content-Type", "application/json");
        },
        dataType: "json",
        url: 'https://api.spotify.com/v1/me/player/currently-playing?market=ES',
        success: function (data) {
            document.getElementById("songName").innerHTML = data.item.name;

            document.getElementById("artistName").innerHTML = "";

            if (data.item.artists.length != 1) {
                for (let i = 0; i < data.item.artists.length - 1; i++) {
                    document.getElementById("artistName").innerHTML += data.item.artists[i].name + ", ";
                }
                document.getElementById("artistName").innerHTML += data.item.artists[data.item.artists.length - 1].name;
            } else {
                document.getElementById("artistName").innerHTML = data.item.artists[0].name;
            }

            document.getElementById("albumArt").src = data.item.album.images[0].url;
            document.getElementById("progressBar").style.width = ((data.progress_ms / data.item.duration_ms) * 320) + "%";
            document.getElementById("timestamps").innerHTML = convert(data.progress_ms) + " / " + convert(data.item.duration_ms);
        },
        error: function (a, b, error) {
            alert("Something went wrong. Please restart the app.");
        }
    });
}


function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function convert(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.round((milliseconds % 60000) / 1000);

    return seconds === 60
        ? `${minutes + 1}:00`
        : `${minutes}:${padTo2Digits(seconds)}`;
}


function tick() {
    getStatus();

    setTimeout(tick, 500);
}

tick();