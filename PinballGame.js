// --- Back to Menu button ---

// --- Play Again button ---
var againBg = game.add.graphics(60, 355);
againBg.beginFill(0x2A2A2A, 1);
againBg.lineStyle(2, 0x6A6A6A, 1);
againBg.drawRect(0, 0, 200, 40);
this.gameOverOverlay.add(againBg);
againBg.inputEnabled = true;
if (againBg.input) againBg.input.useHandCursor = true;

var againTxt = game.add.bitmapText(160, 370, "ArialBlackWhite", "PLAY AGAIN", 18);
againTxt.anchor.set(0.5);
this.gameOverOverlay.add(againTxt);
againTxt.inputEnabled = true;
if (againTxt.input) againTxt.input.useHandCursor = true;

againBg.events.onInputUp.add(this.playAgain, this);
againTxt.events.onInputUp.add(this.playAgain, this);
        playAgain: function () {
  this.disableNameEntry();
  if (this.gameOverOverlay) this.gameOverOverlay.visible = false;
  this.gameOverActive = false;
  this.gameOver = true;
},

        goToMainMenu: function () {
                // CHECKING IF THE GAME IS OVER
                if(this.gameOver==true)
                        {
                        // RESTORING THE BALL TO THE STARTING POSITION
                        this.ballBody.x = this.ballStart[0]*this.PTM;
                        this.ballBody.y = this.ballStart[1]*this.PTM;

                        // CLEARING THE BALL VELOCITY
                        this.ballBody.velocity.x = 0;
                        this.ballBody.velocity.y = 0;
                        this.ballBody.angularVelocity = 0;

                        // SETTING THAT THE GAME IS NOT OVER
                        this.gameOver = false;
                        }
