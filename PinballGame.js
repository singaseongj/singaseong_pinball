            this.menuMainPlayButton = null;
            this.menuMainPlayButtonIcon = null;
            this.menuMainSoundButton = null;
            this.menuMainSoundButtonIcon = null;
            this.menuMainHighscoreButton = null;
            this.menuMainHighscoreButtonIcon = null;
            // ADDING THE APP TITLE SHADOW
            this.menuMainAppTitleShadow = game.add.bitmapText(0, 187, "ArialBlackWhiteBig", "Singaseong\nPinball", 35);
            this.menuMainAppTitleShadow.height = 72;
            this.menuMainAppTitleShadow.position.x = game.width / 2 - this.menuMainAppTitleShadow.width / 2 + 2;
            this.menuMainAppTitleShadow.tint = 0x000000;
            // ADDING THE APP TITLE
            this.menuMainAppTitle = game.add.bitmapText(0, 185, "ArialBlackWhiteBig", "Singaseong\nPinball", 35);
            this.menuMainAppTitle.height = 72;
            this.menuMainAppTitle.position.x = game.width / 2 - this.menuMainAppTitle.width / 2;
            this.menuMainSoundButtonIcon.onInputUp.add(this.toggleSound, this);

            // ADDING THE HIGHSCORE BUTTON
            this.menuMainHighscoreButton = game.add.button(0, 400, "imageMenuButton", null, this, 2, 1, 0);
            this.menuMainHighscoreButton.position.x = game.width / 2 - this.menuMainHighscoreButton.width / 2;
            this.menuMainHighscoreButton.onInputDown.add(function(){if(this.clickTimestamp==null){this.clickTimestamp=this.getCurrentTime();this.clickPositionX=this.game.input.activePointer.position.x;this.clickPositionY=this.game.input.activePointer.position.y;}},this);
            this.menuMainHighscoreButton.onInputUp.add(this.showLeaderboard, this);

            // ADDING THE HIGHSCORE BUTTON ICON
            this.menuMainHighscoreButtonIcon = game.add.button(0, this.menuMainHighscoreButton.position.y + 19, "imageGameHighScore", null, this, 2, 1, 0);
            this.menuMainHighscoreButtonIcon.position.x = this.menuMainHighscoreButton.position.x + this.menuMainHighscoreButton.width / 2 - this.menuMainHighscoreButtonIcon.width / 2 + 2;
            this.menuMainHighscoreButtonIcon.onInputDown.add(function(){if(this.clickTimestamp==null){this.clickTimestamp=this.getCurrentTime();this.clickPositionX=this.game.input.activePointer.position.x;this.clickPositionY=this.game.input.activePointer.position.y;}},this);
            this.menuMainHighscoreButtonIcon.onInputUp.add(this.showLeaderboard, this);

            // CHECKING IF THE SOUND IS DISABLED
            if (GAME_SOUND_ENABLED==false)
                    {
                    // SHOWING THE SOUND DISABLED IMAGES
                    this.menuMainSoundButton.loadTexture("imageMenuButtonDisabled");
                    this.menuMainSoundButtonIcon.loadTexture("imageMenuSoundOff");
                    }
                    else
                    {
                    // SHOWING THE SOUND ENABLED IMAGES
                    this.menuMainSoundButton.loadTexture("imageMenuButton");
                    this.menuMainSoundButtonIcon.loadTexture("imageMenuSoundOn");
                    }

            var closeButton = document.getElementById("close-leaderboard");
            if (closeButton)
                    {
                    closeButton.addEventListener("click", function(){document.getElementById("highscore-modal").classList.add("hidden");});
                    }
          playGame: function()
                  {
                  // REJECTING ANY SLIDE AND LONG PRESS EVENT - BUGFIX FOR SAFARI ON IOS FOR ENABLING THE AUDIO CONTEXT
                  if (Math.abs(this.game.input.activePointer.position.x-this.clickPositionX)>=25){this.clickTimestamp=null;return;}
                  if (Math.abs(this.game.input.activePointer.position.y-this.clickPositionY)>=25){this.clickTimestamp=null;return;}
                  if (this.getCurrentTime()-this.clickTimestamp>=500){this.clickTimestamp=null;return;}
                  game.state.start("Pinball.Game", Phaser.Plugin.StateTransition.Out.SlideLeft);
                  },

          showLeaderboard: function()
                  {
                  var modal = document.getElementById("highscore-modal");
                  if (modal)
                          {
                          modal.classList.remove("hidden");
                          fetch("https://script.google.com/macros/s/AKfycbz5pBJY9qeYThLk1GGDAXAibEey9_hazpRi3PbaY3MuU0h2_1tr8OfSrzTa5IUJMj0/exec")
                                  .then(function(response){return response.json();})
                                  .then(function(data){
                                          var list = document.getElementById("leaderboard-list");
                                          if (list)
                                                  {
                                                  list.innerHTML = "";
                                                  data.scores.forEach(function(entry){
                                                          var li = document.createElement("li");
                                                          li.textContent = entry.name + " - " + entry.score;
                                                          list.appendChild(li);
                                                          });
                                                  }
                                          });
                          }
                  },
            game.physics.box2d.gravity.y = 4000; // LARGE GRAVITY TO MAKE SCENE FEEL SMALLER
            this.buttonBHandler.events.onInputDown.add(function(){this.buttonBHandler.isDown=true;this.buttonBNormal.visible=false;this.buttonBPressed.visible=true;this.update();},this);
            this.buttonBHandler.events.onInputUp.add(function(){this.buttonBHandler.isDown=false;this.buttonBNormal.visible=true;this.buttonBPressed.visible=false;},this);

            var leftTrigger = document.getElementById("left-trigger");
            var rightTrigger = document.getElementById("right-trigger");
            if (leftTrigger)
                    {
                    leftTrigger.addEventListener("touchstart", function(e){e.preventDefault();this.buttonAHandler.isDown=true;this.update();}.bind(this));
                    leftTrigger.addEventListener("touchend", function(e){e.preventDefault();this.buttonAHandler.isDown=false;}.bind(this));
                    leftTrigger.addEventListener("mousedown", function(e){e.preventDefault();this.buttonAHandler.isDown=true;this.update();}.bind(this));
                    leftTrigger.addEventListener("mouseup", function(e){e.preventDefault();this.buttonAHandler.isDown=false;}.bind(this));
                    }
            if (rightTrigger)
                    {
                    rightTrigger.addEventListener("touchstart", function(e){e.preventDefault();this.buttonBHandler.isDown=true;this.update();}.bind(this));
                    rightTrigger.addEventListener("touchend", function(e){e.preventDefault();this.buttonBHandler.isDown=false;}.bind(this));
                    rightTrigger.addEventListener("mousedown", function(e){e.preventDefault();this.buttonBHandler.isDown=true;this.update();}.bind(this));
                    rightTrigger.addEventListener("mouseup", function(e){e.preventDefault();this.buttonBHandler.isDown=false;}.bind(this));
                    }

            var playAgain = document.getElementById("play-again");
            var mainMenu = document.getElementById("main-menu");
            var submitScore = document.getElementById("submit-score");
            var gameOverDiv = document.getElementById("game-over");
            var playerName = document.getElementById("player-name");
            if (playAgain && mainMenu && submitScore && gameOverDiv)
                    {
                    playAgain.addEventListener("click", function(){gameOverDiv.classList.add("hidden");this.resetBall();game.physics.box2d.resume();}.bind(this));
                    mainMenu.addEventListener("click", function(){game.state.start("Pinball.Menu");});
                    submitScore.addEventListener("click", function(){var name=playerName.value||"Anonymous";fetch("https://script.google.com/macros/s/AKfycbz5pBJY9qeYThLk1GGDAXAibEey9_hazpRi3PbaY3MuU0h2_1tr8OfSrzTa5IUJMj0/exec",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:name,score:this.scoreValue})}).then(function(){gameOverDiv.classList.add("hidden");});game.physics.box2d.resume();}.bind(this));
                    }

            // CHECKING IF IT IS A MOBILE DEVICE
            if (this.isMobileDevice==false)
                    {
                    // HIDING THE BUTTON A
            if(this.gameOver==true)
                    {
                    game.physics.box2d.pause();
                    var over = document.getElementById("game-over");
                    if (over)
                            {
                            document.getElementById("final-score-text").textContent = "Score: " + this.scoreValue;
                            over.classList.remove("hidden");
                            }
                    this.gameOver = false;
                    return;
                    }
          resetBall: function()
                  {
                  this.ballBody.x = this.ballStart[0]*this.PTM;
                  this.ballBody.y = this.ballStart[1]*this.PTM;
                  this.ballBody.velocity.x = 0;
                  this.ballBody.velocity.y = 0;
                  this.ballBody.angularVelocity = 0;
                  },

          updateScore: function(newScore)
                  {
