var LEADERBOARD_URL = 'https://script.google.com/macros/s/AKfycbz5pBJY9qeYThLk1GGDAXAibEey9_hazpRi3PbaY3MuU0h2_1tr8OfSrzTa5IUJMj0/exec';
if (!document.getElementById('pinball-style')) {
  var styleLink = document.createElement('link');
  styleLink.id = 'pinball-style';
  styleLink.rel = 'stylesheet';
  styleLink.href = 'style.css';
  document.head.appendChild(styleLink);
}
                this.menuMainPlayButtonIcon = null;
                this.menuMainSoundButton = null;
                this.menuMainSoundButtonIcon = null;
                this.menuMainHighScoreButton = null;
                this.menuMainHighScoreButtonLabel = null;
                this.safariAudioFixPlayer = null;
                this.menuMainAppTitleShadow = game.add.bitmapText(0, 207, "ArialBlackWhiteBig", "Singaseong Pinball", 35);
                this.menuMainAppTitle = game.add.bitmapText(0, 205, "ArialBlackWhiteBig", "Singaseong Pinball", 35);
                this.menuMainSoundButtonIcon.onInputUp.add(this.toggleSound, this);
                // ADDING THE HIGHSCORE BUTTON
                this.menuMainHighScoreButton = game.add.button(0, 530, "imageMenuButton", null, this, 2, 1, 0);
                this.menuMainHighScoreButton.position.x = game.width / 2 - this.menuMainHighScoreButton.width / 2;
                this.menuMainHighScoreButton.onInputUp.add(this.showLeaderboard, this);

                // ADDING THE HIGHSCORE BUTTON LABEL
                this.menuMainHighScoreButtonLabel = game.add.bitmapText(0, this.menuMainHighScoreButton.position.y + 12, "ArialBlackWhiteBig", "Scores", 18);
                this.menuMainHighScoreButtonLabel.position.x = this.menuMainHighScoreButton.position.x + this.menuMainHighScoreButton.width / 2 - this.menuMainHighScoreButtonLabel.width / 2;

                // CHECKING IF THE SOUND IS DISABLED
        toggleSound: function()
                {
                this.clickTimestamp = null;
                },

        showLeaderboard: function()
                {
                var modal = document.createElement('div');
                modal.className = 'highscore-modal';
                modal.innerHTML = '<div class="highscore-modal-content"><h2>Leaderboard</h2><ol id="leaderboard-list"></ol><button id="close-leaderboard">Close</button></div>';
                document.body.appendChild(modal);

                fetch(LEADERBOARD_URL).then(function(r){return r.json();}).then(function(data){
                        var list = document.getElementById('leaderboard-list');
                        data.scores.forEach(function(s){
                                var li = document.createElement('li');
                                li.textContent = s.name + ': ' + s.score;
                                list.appendChild(li);
                        });
                });

                document.getElementById('close-leaderboard').addEventListener('click', function(){
                        modal.remove();
                });
                },
        this.ballStart = [12, -25];
        this.ballSprite = null;
        this.gameOver = false;
        this.gameOverShown = false;
        this.flipperJoints = [];
                this.ballBody = null;
                this.ballSprite = null;
                this.gameOver = false;
                this.gameOverShown = false;
                this.flipperJoints = [];
                        this.buttonBNormal.visible = false;
                        this.buttonBPressed.visible = false;
                        this.buttonBHandler.visible = false;
                        }

                // ADDING ON-SCREEN TRIGGERS
                if (!document.querySelector('.left-trigger')) {
                        var leftTrigger = document.createElement('button');
                        leftTrigger.className = 'trigger left-trigger';
                        leftTrigger.innerHTML = '\u25C0';
                        document.body.appendChild(leftTrigger);
                        leftTrigger.addEventListener('mousedown', function(){game.state.states["Pinball.Game"].buttonAHandler.isDown = true;});
                        leftTrigger.addEventListener('mouseup', function(){game.state.states["Pinball.Game"].buttonAHandler.isDown = false;});
                        leftTrigger.addEventListener('touchstart', function(e){e.preventDefault();game.state.states["Pinball.Game"].buttonAHandler.isDown = true;});
                        leftTrigger.addEventListener('touchend', function(e){e.preventDefault();game.state.states["Pinball.Game"].buttonAHandler.isDown = false;});
                }
                if (!document.querySelector('.right-trigger')) {
                        var rightTrigger = document.createElement('button');
                        rightTrigger.className = 'trigger right-trigger';
                        rightTrigger.innerHTML = '\u25B6';
                        document.body.appendChild(rightTrigger);
                        rightTrigger.addEventListener('mousedown', function(){game.state.states["Pinball.Game"].buttonBHandler.isDown = true;});
                        rightTrigger.addEventListener('mouseup', function(){game.state.states["Pinball.Game"].buttonBHandler.isDown = false;});
                        rightTrigger.addEventListener('touchstart', function(e){e.preventDefault();game.state.states["Pinball.Game"].buttonBHandler.isDown = true;});
                        rightTrigger.addEventListener('touchend', function(e){e.preventDefault();game.state.states["Pinball.Game"].buttonBHandler.isDown = false;});
                }

                // GETTING THE CURSOR KEY INPUTS
                this.cursors = game.input.keyboard.createCursorKeys();
                if(this.gameOver==true && this.gameOverShown==false)
                        {
                        this.gameOverShown = true;
                        game.physics.box2d.pause();
                        this.showGameOverMenu();
                        }
                else if (this.launcherSprite.position.y>=-100)
                        {
                        // SETTING THAT THE LAUNCHER WILL NOT BE MOVING ANY MORE
                        this.launcherIsMoving = false;
                        }
                }
                },

        showGameOverMenu: function()
                {
                var overlay = document.createElement('div');
                overlay.className = 'game-over';
                overlay.innerHTML = '<div class="game-over-content"><h2>Game Over</h2><div class="menu"><button id="play-again">Play Again</button><button id="main-menu">Main Menu</button><input id="player-name" placeholder="Name"/><button id="save-score">Save Score</button></div></div>';
                document.body.appendChild(overlay);

                document.getElementById('play-again').addEventListener('click', function(){
                        overlay.remove();
                        game.physics.box2d.resume();
                        game.state.start("Pinball.Game");
                });
                document.getElementById('main-menu').addEventListener('click', function(){
                        overlay.remove();
                        game.physics.box2d.resume();
                        game.state.start("Pinball.Menu");
                });
                document.getElementById('save-score').addEventListener('click', function(){
                        var name = document.getElementById('player-name').value || 'Anonymous';
                        fetch(LEADERBOARD_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,score:game.state.states["Pinball.Game"].scoreValue})}).then(function(){
                                overlay.remove();
                                game.physics.box2d.resume();
                                game.state.start("Pinball.Menu");
                        });
                });
                },

        render: function()
                {
