function XMLscene() {
    CGFscene.call(this);
    this.CAMERA_ANIMATION_TIME = 1.5;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * init
 * initializes the scene settings, camera, and light arrays
 */
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.lights = [];
    this.lightIDs = [];
    this.lightStatus = [];
    this.cameras = [];
    this.rootNode;
    this.seqNum = 0;
    this.setUpdatePeriod(1 / 60 * 1000);

    this.setPickEnabled(true);
    this.theme = 0;
    this.game = new Game();

};

/**
 * set the default scene appearance
 */
XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.2, 0.2, 1.0);
    this.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.setShininess(10.0);
};


// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {
    this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
    this.gl.clearColor(this.graph.bg[0], this.graph.bg[1], this.graph.bg[2], this.graph.bg[3]);

    //Sets the axis
    this.axis = new CGFaxis(this, this.axisLength);

    //Sets default camera
    this.camera = this.cameras[this.currentCamera];
    this.interface.setActiveCamera(this.camera);
    this.setUpdatePeriod(20);

    //GUI for light control
    for (let i = 0; i < this.lights.length; i++)
        this.lightStatus.push(this.lights[i].enabled);

    this.rootNode.updateTextures(this.graph.textures);
    this.lastUpdateTime = Date.now();
    this.graph.loadedOk = true;
};

/**
 * Change the theme if necessary
 * @param theme Theme
 */
XMLscene.prototype.loadTheme = function (theme) {
    if (theme == THEME.NORMAL) {
        let filename = getUrlVars()['file'] || "LAIG_TP3_DSX_T2_G06_v01.dsx";
        this.lights = [];
        this.cameras = [];
        this.graph = new MySceneGraph(filename, this);
    }
    else {
        let filename = getUrlVars()['file'] || "LAIG_TP3_DSX_T2_G06_v02.dsx";
        this.cameras = [];
        this.lights = [];
        this.graph = new MySceneGraph(filename, this);
    }
};
/**
 * Initializes game class.
 * @param gameMode Game mode.
 * @param data Response
 * @param botDifficulty Bot difficulty
 */
XMLscene.prototype.newGame = function (gameMode, botDifficulty, data) {

    this.rootNode.children = [];
    //Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes
    let response = JSON.parse(data.target.response);
    let board = response[0];
    let ships = response[1];                //Array with the players' ships, represented by their position in the board
    let tradeStations = response[2];        //Array with the players' trade stations, same as with the ships
    let colonies = response[3];             //Array with the players' colonies, same as trade stations and ships
    let homeSystems = response[4];
    let wormholes = response[5];            //Array with the position of the wormholes on the board

    this.game.newGame(this, gameMode);
    this.game.createBoard(board, this.graph.components);
    this.game.createAuxBoards(this.graph.components, this.graph.materials);
    this.game.initializeShips(ships, this.graph.materials);
    this.game.setTradeStations(tradeStations);
    this.game.setColonies(colonies);
    this.game.setHomeSystems(homeSystems);
    this.game.setWormholes(wormholes);
    this.game.setBotDifficulty(botDifficulty, botDifficulty);

    this.game.addOnScoreCanChange(this.updateScores.bind(this));
    this.game.addOnPlayerChanged(this.onPlayerChanged.bind(this));

    this.camera = this.cameras[0];
    this.changingCamera = false;
    this.currentCamera = 0;

    this.rootNode.updateTextures(this.graph.textures);

    document.getElementById('overlay').style.display = 'block';
    let scores = document.getElementsByClassName('score');

    this.scores = [0, 0];
    for (let score of scores)
        score.innerHTML = '0';

    this.game.startGame();
};

/**
 * Callback to call when the player has changed.
 */
XMLscene.prototype.onPlayerChanged = function () {
    this.nextCamera();
};

/**
 * Change game to normal mode.
 */
XMLscene.prototype.cancelMode = function () {
    this.game.cancelMode();
};

XMLscene.prototype.update = function (currTime) {
    if (!this.graph.loadedOk)
        return;


    let deltaTime = currTime - this.lastUpdateTime;
    this.rootNode.update(deltaTime, this.seqNum);
    this.game.update(deltaTime);
    this.animateCamera(deltaTime);
    this.seqNum = (this.seqNum + 1) % 2;
    this.lastUpdateTime = currTime;
};

XMLscene.prototype.display = function () {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    if (this.graph.loadedOk) {
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        this.handlePicking();
        this.clearPickRegistration();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.setDefaultAppearance();

        // ---- END Background, camera and axis setup

        //Update lights
        for (let i = 0; i < this.lights.length; i++) {
            if (this.lightStatus[i])
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();
        }

        if (this.game.isRunning()) {
            document.getElementById('time_left').innerText = this.game.getTimeSinceLastPlay() + 's';
            let timeElapsed = this.game.getTimeElapsed();

            if (timeElapsed / 60 >= 10)
                document.getElementById('time_elapsed').innerText = (timeElapsed / 60 | 0).toString();
            else
                document.getElementById('time_elapsed').innerText = '0' + (timeElapsed / 60 | 0).toString();

            document.getElementById('time_elapsed').innerText += 'm';

            if (timeElapsed % 60 >= 10)
                document.getElementById('time_elapsed').innerText += (timeElapsed % 60).toString();
            else
                document.getElementById('time_elapsed').innerText += '0' + (timeElapsed % 60).toString();

            document.getElementById('time_elapsed').innerText += 's';

            if (this.game.gameState === GAMESTATE.BOT_PLAY)
                document.getElementById('instruction').innerText = 'A bot is playing, please wait.';
            else if (this.game.gameState === GAMESTATE.REPLAY)
                document.getElementById('instruction').innerText = 'The game is being replayed, please wait.';
            else if (this.game.gameState === GAMESTATE.GAME_OVER) {
                document.getElementById('instruction').innerText = 'Game over.';

                if (this.scores[0] > this.scores[1])
                    document.getElementById('instruction').innerText += 'Player 1 won!';
                else if (this.scores[0] === this.scores[1])
                    document.getElementById('instruction').innerText += 'It\'s a draw!';
                else
                    document.getElementById('instruction').innerText += 'Player 2 won!';


            } else
                document.getElementById('instruction').innerText =
                    'Player ' + (this.game.getCurrentPlayer() + 1) + ', ' + this.game.getGameStateInstruction();
        }

        this.interface.setActiveCamera(this.camera);
        this.rootNode.display();

        // Draw axis
        this.axis.display();
    }
};

XMLscene.prototype.updateScores = function () {
    calculatePoints(this.game.board.getStringBoard(), this.game.tradeStations,
        this.game.colonies, this.game.homeSystems, 0, this.updateScoreDisplay.bind(this, 0));

    calculatePoints(this.game.board.getStringBoard(), this.game.tradeStations,
        this.game.colonies, this.game.homeSystems, 1, this.updateScoreDisplay.bind(this, 1));
};

XMLscene.prototype.updateScoreDisplay = function (playerNo, response) {
    this.scores[playerNo] = response.target.response;
    document.getElementsByClassName('score')[playerNo].innerHTML = response.target.response;
};

XMLscene.prototype.switchMaterials = function () {
    this.rootNode.switchMaterials();
};

/**
 * Switches camera to the next one on the scene cameras array
 */
XMLscene.prototype.nextCamera = function () {
    //this.currentCamera = (this.currentCamera + 1) % this.cameras.length;

    this.changingCamera = true;
    this.timeElapsed = 0;
};

/**
 * Animates the camera transition
 * @param deltaTime Delta time
 */
XMLscene.prototype.animateCamera = function (deltaTime) {
    if (!this.changingCamera)
        return;

    // *0.95 is to avoid flickering when the animation surpasses the expected camera position
    if (this.timeElapsed > this.CAMERA_ANIMATION_TIME * 0.95) {
        this.changingCamera = false;
        this.currentCamera = (this.currentCamera + 1) % this.cameras.length;
        this.camera = this.cameras[this.currentCamera];
        return;
    }

    let currCamera = this.cameras[this.currentCamera];
    let nextCamera = this.cameras[(this.currentCamera + 1) % this.cameras.length];

    let targetCenter = midPoint(currCamera.target, nextCamera.target);
    let positionCenter = midPoint(currCamera.position, nextCamera.position);

    let targetRadius = distance(targetCenter, nextCamera.target);
    let positionRadius = distance(positionCenter, nextCamera.position);

    this.timeElapsed += deltaTime / 1000;
    let cameraAngle = Math.PI * this.timeElapsed / this.CAMERA_ANIMATION_TIME;
    let multiplier = this.currentCamera ? 1 : -1;


    let targetPosition = [
        targetCenter[0] + multiplier * targetRadius * Math.sin(cameraAngle),
        targetCenter[1],
        targetCenter[2] + multiplier * targetRadius * Math.cos(cameraAngle),
        1
    ];

    let positionPosition = [
        positionCenter[0] + multiplier * positionRadius * Math.sin(cameraAngle),
        positionCenter[1],
        positionCenter[2] + multiplier * positionRadius * Math.cos(cameraAngle),
        1
    ];

    this.camera = new CGFcamera(currCamera.fov, currCamera.near, currCamera.far,
        positionPosition, targetPosition);
};

/**
 * Handles the scene picking.
 */
XMLscene.prototype.handlePicking = function () {
    for (let picking of this.pickResults)
        if (picking[0])
            this.game.picked(picking[1]);

    this.pickResults.splice(0);
};

