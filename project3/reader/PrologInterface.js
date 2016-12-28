/**
 * Sends a request to prolog server
 * @param requestString Request string
 * @param context Context to pass to callback.
 * @param onSuccess On success callback.
 * @param onError On error callback.
 * @param port Port to connect.
 */
function getPrologRequest(requestString, onSuccess, onError, port) {
    let requestPort = port || 8081;
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess;

    request.onerror = onError || prologRequestError;

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

/**
 * Function called when there is an error in a Prolog Request.
 * @param data Data received from the request.
 */
function prologRequestError(data) {
    console.log('Prolog request error:');
    console.log(data);
}

/**
 * Moves the ship related to the this.selected variable.
 * @param ships Ships matrix
 * @param playerNo Player number
 * @param shipNo Ship number
 * @param newPosition Ship position
 * @param callback Callback.
 */
function moveShip(ships, playerNo, shipNo, newPosition, callback) {
    let requestString = 'move('
        + JSON.stringify(ships) + ','
        + playerNo + ','
        + shipNo + ','
        + JSON.stringify(newPosition) + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Places the trade station in the last selected ship position.
 */
function placeTradeStation(tradeStations, playerNo, shipNo, shipPosition, callback) {

    let requestString = 'place_trade_station('
        + playerNo + ','
        + JSON.stringify(shipPosition) + ','
        + JSON.stringify(tradeStations) + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Places the colony in the last selected ship position.
 */
function placeColony(colonies, playerNo, shipNo, shipPosition, callback) {

    let requestString = 'place_colony('
        + playerNo + ','
        + JSON.stringify(shipPosition) + ','
        + JSON.stringify(colonies) + ')';

    getPrologRequest(requestString, callback);
}

function calculatePoints(board, tradeStations, colonies, homeSystems, playerNo, callback) {
    let requestString = 'calc_points('
        + JSON.stringify(board).replace(/"/g, '') + ','
        + JSON.stringify(tradeStations) + ','
        + JSON.stringify(colonies) + ','
        + JSON.stringify(homeSystems) + ','
        + playerNo + ')';

    getPrologRequest(requestString, callback);
}