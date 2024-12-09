const serverStatusUrl = '/status/'; // Path to server status endpoints
const serverId = ['io', 'europa', 'ganymede', 'callisto']; // Ids of every server status endpoint
const refreshTime = 30000; // How often to update the server listing, in milliseconds
const nameElementId = 'servertab-name-'; // Server name element id in the page, takes from serverId, ex: serverName-io
const descElementId = 'servertab-desc-'; // Server description (map, players, etc).

serverId.forEach(serverId => {
    updateServer(serverId);
    setInterval(() => updateServer(serverId), refreshTime);
});

function updateServer(serverId) {
    var serverUrl = serverStatusUrl + `${serverId}/`;

    fetch(serverUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            } else {
                return resp.json();
            }
        })
        .then((json) => {
            if (!validateServer(json)) {
                throw new Error('Invalid response');
            }
            updateDisplay(json, serverId);
        })
        .catch((error) => {
            console.error(error);
        });
}

function validateServer(json) {
    return json.hasOwnProperty('name') &&
           json.hasOwnProperty('players') &&
           json.hasOwnProperty('map' ) && 
           json.hasOwnProperty('round_id') && 
           json.hasOwnProperty('soft_max_players') && 
           json.hasOwnProperty('preset');
           //json.hasOwnProperty('round_start_time');
}

function roundTime(roundStartTime) {
    if (roundStartTime !== null && roundStartTime !== undefined){
        const roundStartDate = new Date(Date.parse(roundStartTime)); // Start time of the round
        const currentTime = new Date(); // Current time
        
        const elapsedTime = currentTime - roundStartDate; // Elapsed time in milliseconds
        
        // Convert milliseconds to seconds
        const elapsedSeconds = Math.floor(elapsedTime / 1000);
        
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        
        // Format as HH:mm:ss, ensuring 2 digits for minutes and seconds
        const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        
        return formattedTime;
    }
    else {
        const noTimeString = 'Pre-round Lobby';
        return noTimeString;
    }
  }
  
  // Helper function to pad single digit values with leading zero
  function padZero(value) {
    return value < 10 ? '0' + value : value;
  }

function updateDisplay(json, serverId) {
    var serverName = document.getElementById(nameElementId + `${serverId}`);
    var serverDesc = document.getElementById(descElementId + `${serverId}`);

    var roundStartTime = `${json.round_start_time}`;
    var currentRoundTime = roundTime(roundStartTime);

    if (serverName && serverDesc) {
        serverName.textContent =`${json.name}`;
        serverDesc.textContent = `Players: ${json.players} / ${json.soft_max_players}` + '\n' + 
                                 `Round Time: `+ currentRoundTime + '\n' +
                                 `Map: ${json.map}` + '\n' +
                                 `Gamemode: ${json.preset}` + '\n' +
                                 `Round: ${json.round_id}`;
    }
}