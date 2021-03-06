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

/**
 * Calculates points from given arguments
 * @param board Board
 * @param tradeStations Trade stations
 * @param colonies Colonies
 * @param homeSystems Home systems
 * @param playerNo Player number
 * @param callback Callback
 */
function calculatePoints(board, tradeStations, colonies, homeSystems, playerNo, callback) {
    let requestString = 'calc_points('
        + JSON.stringify(board).replace(/"/g, '') + ','
        + JSON.stringify(tradeStations) + ','
        + JSON.stringify(colonies) + ','
        + JSON.stringify(homeSystems) + ','
        + playerNo + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Gets valid directions
 * @param board Board
 * @param ships Ships
 * @param tradeStations Trade stations
 * @param colonies Colonies
 * @param wormholes Wormholes
 * @param position Position
 * @param callback Callback
 */
function getValidMoves(board, ships, tradeStations, colonies, wormholes, position, callback) {
    let requestString = 'get_valid_moves('
        + JSON.stringify(board).replace(/"/g, '') + ','
        + JSON.stringify(ships) + ','
        + JSON.stringify(tradeStations) + ','
        + JSON.stringify(colonies) + ','
        + JSON.stringify(wormholes) + ','
        + JSON.stringify(position) + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Moves a ship using easy AI.
 * @param board Board
 * @param ships Ships
 * @param tradeStations Trade stations
 * @param colonies Colonies
 * @param wormholes Wormholes
 * @param playerNo Player number
 * @param callback Callback
 */
function easyCPUMove(board, ships, tradeStations, colonies, wormholes, playerNo, callback) {
    let requestString = 'easy_cpu_move('
        + JSON.stringify(board).replace(/"/g, '') + ','
        + JSON.stringify(ships) + ','
        + JSON.stringify(tradeStations) + ','
        + JSON.stringify(colonies) + ','
        + JSON.stringify(wormholes) + ','
        + '2,3,'
        + playerNo + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Places building using easy AI.
 * @param ships Ships
 * @param playerNo Player number
 * @param shipNo Ship number
 * @param tradeStations Trade stations
 * @param colonies Colonies
 * @param callback Callback
 */
function easyCPUPlaceBuilding(ships, playerNo, shipNo, tradeStations, colonies, callback) {
    let requestString = 'easy_cpu_select_action('
        + JSON.stringify(ships) + ','
        + playerNo + ','
        + shipNo + ','
        + JSON.stringify(tradeStations) + ','
        + JSON.stringify(colonies) + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Moves ship using hard AI.
 * @param board Board
 * @param ships Ships
 * @param tradeStations Trade stations
 * @param colonies Colonies
 * @param wormholes Wormholes
 * @param playerNo Player number
 * @param callback Callback
 */
function hardCPUMove(board, ships, tradeStations, colonies, wormholes, playerNo, callback) {
    let requestString = 'hard_cpu_move('
        + JSON.stringify(board).replace(/"/g, '') + ','
        + JSON.stringify(ships) + ','
        + JSON.stringify(tradeStations) + ','
        + JSON.stringify(colonies) + ','
        + JSON.stringify(wormholes) + ','
        + '2,3,'
        + playerNo + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Places building using hard AI.
 * @param ships Ships
 * @param playerNo Player number
 * @param shipNo Ship number
 * @param tradeStations Trade stations
 * @param colonies Colonies
 * @param callback Callback
 */
function hardCPUPlaceBuilding(ships, playerNo, shipNo, tradeStations, colonies, callback) {
    let requestString = 'hard_cpu_select_action('
        + JSON.stringify(ships) + ','
        + playerNo + ','
        + shipNo + ','
        + JSON.stringify(tradeStations) + ','
        + JSON.stringify(colonies) + ')';

    getPrologRequest(requestString, callback);
}

/**
 * Checks if game is over.
 * @param board Board
 * @param ships Ships
 * @param tradeStations Trade stations
 * @param colonies Colonies
 * @param wormholes Wormholes
 * @param callback Callback
 */
function isGameOver(board, ships, tradeStations, colonies, wormholes, callback) {
    let requestString = 'is_game_over('
        + JSON.stringify(board).replace(/"/g, '') + ','
        + JSON.stringify(ships) + ','
        + JSON.stringify(tradeStations) + ','
        + JSON.stringify(colonies) + ','
        + JSON.stringify(wormholes) + ')';

    getPrologRequest(requestString, callback);
}