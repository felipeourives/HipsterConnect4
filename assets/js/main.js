"use strict";

// GLOBALS
let stage;
let topContainer;
let midContainer;
let btnContainer;
let renderer;
let displayMsg;
let currentPlayer;
let board;
let isGameOver;
let animateOn;
let lastVancancyRow;
let player1Disk = './assets/img/player1.png';
let player2Disk = './assets/img/player2.png';

// Set animation loop
requestAnimationFrame(animate);

function animate(){
    
    // Render Stage
    renderer.render(stage);

    requestAnimationFrame(animate);
}

// The connect 4 classes
class connect4 { 

    init(){

        // Create an new instance of a pixi stage
        stage = new PIXI.Stage(6750105);

        // Create 3 containers
        topContainer = new PIXI.Container();
        midContainer = new PIXI.Container();
        btnContainer = new PIXI.Container();

        stage.addChild(btnContainer);
        stage.addChild(midContainer);
        stage.addChild(topContainer);
        
        // Create a renderer instance
        renderer = PIXI.autoDetectRenderer(640, 500);
        
        // Add the render object to the game canvas
        document.getElementById('gameCanvas').appendChild(renderer.view);

        // Set some initial variables
        lastVancancyRow = 5;
        currentPlayer = 'player1';
        isGameOver = false;
        animateOn = false;

        // Creat a matrix to represent the spots of the board
        board = [ [ 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0 ] ];

        // Create the clickable board
        let boardSpot;

        for (let i = 6; i >= 0; i--) {
            for (let j = 5; j >= 0; j--) {
                boardSpot = new PIXI.Graphics;
                boardSpot.beginFill(16777215, 0);
                boardSpot.drawRect(0, 0, 50, 50);
                boardSpot.endFill();

                boardSpot.buttonMode = true;
                boardSpot.interactive = true;
                boardSpot.position.x = 110 + 60 * i;
                boardSpot.position.y = 80 + 55 * j;
                boardSpot.val = j + "-" + i;
                boardSpot.on('mousedown', this.spotOnClick);

                stage.addChild(boardSpot);
            }
        }

        // Create the sprite for the board
        let spriteBoard = PIXI.Sprite.fromImage('./assets/img/board.png');
        spriteBoard.position.x = 84;
        spriteBoard.position.y = 58;
        topContainer.addChild(spriteBoard);
        
        // Create a white rectangle and placed on back of the board
        let recBack = new PIXI.Graphics;
        recBack.beginFill('0x222222', 0.9);
        recBack.drawRect(84, 58, 461, 405);
        recBack.endFill();
        midContainer.addChild(recBack);

        // Create the sprite for de background
        let spriteBG = PIXI.Sprite.fromImage('./assets/img/bg.jpg');
        spriteBG.width = 640;
        btnContainer.addChild(spriteBG);

        // Create the object for the display text
        displayMsg = new PIXI.Text('Your move Player 1', {font: 'Bold 20px Arial', fill: '#222'});
        displayMsg.x = 110;
        displayMsg.y = 420;
        topContainer.addChild(displayMsg); 
    }


    // When someone clicked on a spot, 
    spotOnClick(obj){
        if(!animateOn && !isGameOver){

            // Set the state animateOn
            animateOn = true;

            // Set the colmun of the clicked spot, and the first empty row of this column
            let clickedColoumn = Number(obj.target.val.split('-')[1]);
            const rowLength = board.length;
            const rowObj = connect4.findEmptyRow(clickedColoumn, rowLength - 1);

            // If there is a any empty spot on the clicked column
            if(rowObj.available) {
                const insertionSpot = `${ rowObj.spot }-${ clickedColoumn }`;
                connect4.setDisk(insertionSpot);
            }
        }
    }

    // Find the empty spot in the column
    static findEmptyRow(a, index){

        for(let i = board.length -1; i >= 0 ; i--){

            if (board[i][a] == 0){

                return {
                    available: true,
                    spot: i
                };
            }
        }

        // Return false if there is anyone empty spot in the column
        return {
            available: false,
            spot: -1
        };
    }

    // Change the player.
    static changePlayer(){
        
        // Check the game status
        connect4.checkCurrentGameStatus();
        
        if(!isGameOver) {
            if(currentPlayer == 'player1'){
            
                currentPlayer = 'player2';
                displayMsg.text = 'Your move Player 2';
            
            }else{
                currentPlayer = 'player1';
                displayMsg.text = 'Your move Player 1';
            }
        }
    }

    // Check if a player won
    static checkAnybodyWon(checkForPlayer){

        // Check if anyone won on the horizontal and vertical
        for(let i = board.length - 1; i >= lastVancancyRow; i--){
            
            for(let j = 0; j < board[i].length; j++){
                
                // Horizontal check
                if( checkForPlayer === board[i][j] && 
                    board[i][j] === board[i][j + 1] && 
                    board[i][j] === board[i][j + 2] && 
                    board[i][j] === board[i][j + 3] && 
                    board[i][j + 3] !== undefined
                    ){
                    return true;
                }

                // Vertical check
                if(i - 3 >= 0){

                    if( checkForPlayer === board[i][j] && 
                        board[i][j] === board[i - 1][j] && 
                        board[i - 1][j] === board[i - 2][j] && 
                        board[i - 2][j] === board[i - 3][j] && 
                        board[i - 3] !== undefined 
                        ){
                        
                        return true;
                    }
                }
            }
        }

        // Check if anyone won on the diagonal
        for(let i = board.length - 1; i >= 3; i--){

            // On the Right part
            for(let j = 0; j < board[i].length; j++){
           
                if( board[i - 3] !== undefined && 
                    checkForPlayer === board[i][j] && 
                    board[i][j] === board[i - 1][j + 1] && 
                    board[i - 1][j + 1] === board[i - 2][j + 2] && 
                    board[i - 2][j + 2] === board[i - 3][j + 3] 
                    ){

                    return true;
                }
            }

            // On the Left part
            for(let j = board[i].length - 1; j >= 0; j--){

                if( board[i - 3] !== undefined && 
                    checkForPlayer === board[i][j] && 
                    board[i][j] === board[i - 1][j - 1] && 
                    board[i - 1][j - 1] === board[i - 2][j - 2] && 
                    board[i - 2][j - 2] === board[i - 3][j - 3]
                    ){

                    return true;
                }
            }
        }

        return false;
    }


    // Check if the game is draw
    static checkIfTie() {

        // If all the board spots is not avaible and anybody won, so the game is draw
        if( !connect4.findEmptyRow(0, board.length - 1).available && 
            !connect4.findEmptyRow(1, board.length - 1).available && 
            !connect4.findEmptyRow(2, board.length - 1).available && 
            !connect4.findEmptyRow(3, board.length - 1).available && 
            !connect4.findEmptyRow(4, board.length - 1).available && 
            !connect4.findEmptyRow(5, board.length - 1).available && 
            !connect4.findEmptyRow(6, board.length - 1).available
            ){
            return true;
        
        }else{
            false;
        }
    }

    // Check if any player won
    static checkCurrentGameStatus(){
        // 
        if(this.checkAnybodyWon(currentPlayer)){
            isGameOver = true;

            let currentplaytext = (currentPlayer == 'player1')? "Player 1":"Player 2";
            displayMsg.text = currentplaytext+' is the winner.';

        }else if(this.checkIfTie()){
            isGameOver = true;

            currentPlayer = 'Game is Tie.';
        }
    }

    // Set a disk at a available spot.
    static setDisk(spot){

        let insertionSpot = spot;

        // Search for the object in the stage children 
        for (let i = 0; i < stage.children.length; i++){
            
            if(stage.children[i].val !== undefined && stage.children[i].val === insertionSpot){
                
                let dick;

                if(currentPlayer == "player1"){
    
                    dick = player1Disk;
                }else{

                    dick = player2Disk;
                } 

                // Update the last vancancy row
                if (spot.split('-')[0] < lastVancancyRow){
                    lastVancancyRow = spot.split('-')[0];
                }

                // Update the board Matrix
                board[spot.split('-')[0]][spot.split('-')[1]] = currentPlayer;

                // Create a circle and move to the chosen spot
                let circle = PIXI.Sprite.fromImage(dick);
                circle.position.x = stage.children[i].x -3;

                TweenLite.to(circle.position, 1, {y: (stage.children[i].y), onComplete: function(){
                    
                    // Remove the animation on state
                    animateOn = false;

                    // Change the player turn.
                } });
                
                midContainer.addChild(circle);

                // Change the player
                connect4.changePlayer();

            }
        }
    }

    // Reset the Game
    resetgame(){

        document.getElementById('gameCanvas').removeChild(renderer.view);
        this.init();
        
    }

}

// Creat a connect4 object
let playConnect4 = new connect4;