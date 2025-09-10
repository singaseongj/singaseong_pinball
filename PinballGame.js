                game.physics.startSystem(Phaser.Physics.BOX2D);
                game.physics.box2d.ptmRatio = 500;
                // CHANGED (was 5000): slightly lower gravity to slow the ball a bit
                game.physics.box2d.gravity.y = 4200;
                game.physics.box2d.friction = 0.1;
                this.ballBody = new Phaser.Physics.Box2D.Body(this.game, null, this.ballStart[0] * this.PTM, this.ballStart[1] * this.PTM);
                this.ballBody.setCircle(0.64 * this.PTM);
                this.ballBody.bullet = true;
                // NEW: tiny air resistance to reduce runaway speed without feeling “sticky”
                this.ballBody.linearDamping = 0.12;
                this.ballBody.setFixtureContactCallback(this.gutterFixture1, function() {
                  // CHANGED: don’t wipe the score here; end the game and show options
                  this.gameOver = true;
                  this.endGame(); // NEW
                }, this);
                this.ballBody.setFixtureContactCallback(this.gutterFixture2, function() {
                  // CHANGED: don’t wipe the score here; end the game and show options
                  this.gameOver = true;
                  this.endGame(); // NEW
                }, this);
                this.highScoreLabel = game.add.bitmapText(66, -523.25, "ArialBlackWhite", this.getHighscore(), 27);
                this.highScoreLabel.height = 32;

                // ================================
                // NEW: Make High Score clickable
                // ================================
                this.highScoreBackground.inputEnabled = true;
                this.highScoreBackground.input.useHandCursor = true;
                this.highScoreBackground.events.onInputUp.add(function(){
                  this.showLeaderboard(); // NEW
                }, this);

                this.highScoreIcon.inputEnabled = true;
                this.highScoreIcon.input.useHandCursor = true;
                this.highScoreIcon.events.onInputUp.add(function(){
                  this.showLeaderboard(); // NEW
                }, this);

                // NEW: a small explicit LEADERBOARD button next to the highscore box
                this.leaderboardBtn = game.add.graphics();
                this.leaderboardBtn.beginFill(0x0066CC, 1);
                this.leaderboardBtn.lineStyle(2, 0x0046A9, 1);
                this.leaderboardBtn.drawRoundedRect(160, -530, 145, 40, 10);
                this.leaderboardBtn.inputEnabled = true;
                this.leaderboardBtn.input.useHandCursor = true;
                this.leaderboardBtn.events.onInputUp.add(function(){ this.showLeaderboard(); }, this);
                this.leaderboardBtnText = game.add.bitmapText(172, -523.5, "ArialBlackWhite", "LEADERBOARD", 20);
                this.leaderboardBtnText.height = 24;

                // ADDING THE SOUND HANDLER ON BACKGROUND
                this.soundHandlerOnBackground = game.add.graphics();
                this.buttonBHandler.events.onInputUp.add(function(){this.buttonBHandler.isDown=false;this.buttonBNormal.visible=true;this.buttonBPressed.visible=false;},this);

                // ===============================
                // NEW: Left/Right side tab buttons
                // ===============================
                this.leftTabDown = false;
                this.rightTabDown = false;

                // Left tab (vertical strip)
                this.leftTab = game.add.graphics();
                this.leftTab.beginFill(0x000000, 0.15);
                this.leftTab.drawRoundedRect(-8, -480, 26, 360, 6);
                this.leftTab.endFill();
                this.leftTab.inputEnabled = true;
                this.leftTab.fixedToCamera = true;
                this.leftTab.input.useHandCursor = true;
                this.leftTab.events.onInputDown.add(function(){ this.leftTabDown = true; this.update(); }, this);
                this.leftTab.events.onInputUp.add(function(){ this.leftTabDown = false; }, this);

                // Right tab (vertical strip)
                this.rightTab = game.add.graphics();
                this.rightTab.beginFill(0x000000, 0.15);
                this.rightTab.drawRoundedRect(302, -480, 26, 360, 6);
                this.rightTab.endFill();
                this.rightTab.inputEnabled = true;
                this.rightTab.fixedToCamera = true;
                this.rightTab.input.useHandCursor = true;
                this.rightTab.events.onInputDown.add(function(){ this.rightTabDown = true; this.update(); }, this);
                this.rightTab.events.onInputUp.add(function(){ this.rightTabDown = false; }, this);

                // CHECKING IF IT IS A MOBILE DEVICE
                // CHANGED: do not auto-respawn the ball
                if (this.gameOver === true) {
                  // paused by endGame(); wait for user choice
                }
                // CHANGED: include side-tab presses in the checks
                var leftPressed  = this.cursors.left.isDown === true  || this.keyA.isDown === true || this.buttonAHandler.isDown === true || this.leftTabDown;
                var rightPressed = this.cursors.right.isDown === true || this.keyD.isDown === true || this.buttonBHandler.isDown === true || this.rightTabDown;

                // LEFT
                if (leftPressed) {
                  if (GAME_SOUND_ENABLED===true) {
                    if (this.flipperJoints[0].m_motorSpeed != -15) {
                      this.audioPlayer = this.add.audio("soundFlipper");
                      this.audioPlayer.play();
                    }
                  }
                  this.flipperJoints[0].m_enableMotor = true;
                  this.flipperJoints[0].SetMotorSpeed(-15);
                } else {
                  if (-25 > this.leftFlipper.angle) {
                    this.flipperJoints[0].SetMotorSpeed(15);
                  }
                }

                // RIGHT
                if (rightPressed) {
                  if (GAME_SOUND_ENABLED===true) {
                    if (this.flipperJoints[1].m_motorSpeed != 15) {
                      this.audioPlayer = this.add.audio("soundFlipper");
                      this.audioPlayer.play();
                    }
                  }
                  this.flipperJoints[1].m_enableMotor = true;
                  this.flipperJoints[1].SetMotorSpeed(15);
                } else {
                  if (25 < this.rightFlipper.angle) {
                    this.flipperJoints[1].SetMotorSpeed(-15);
                  }
                }
                },

        // ================================
        // === NEW: UI / Overlay system ===
        // ================================

        createOverlayRoot: function() {
          if (this.overlayGroup) { return; }
          this.overlayGroup = game.add.group();
          this.overlayGroup.fixedToCamera = true;
          this.overlayGroup.cameraOffset.setTo(0, 0);
          this.overlayGroup.visible = false;

          // Dim background
          this.overlayDim = game.add.graphics(0,0, this.overlayGroup);
          this.overlayDim.beginFill(0x000000, 0.6);
          this.overlayDim.drawRect(0, 0, 320, 608);
          this.overlayDim.endFill();

          // Panel
          this.overlayPanel = game.add.graphics(0,0, this.overlayGroup);
          this.overlayPanel.beginFill(0x1A1A1A, 1);
          this.overlayPanel.lineStyle(2, 0x444444, 1);
          this.overlayPanel.drawRoundedRect(20, 80, 280, 448, 14);
          this.overlayPanel.endFill();

          this.overlayTitle = game.add.bitmapText(40, 100, "ArialBlackWhite", "", 26, this.overlayGroup);
          this.overlayTitle.height = 32;

          // Container for dynamic text
          this.overlayTextGroup = game.add.group(this.overlayGroup);

          // Close button (X)
          this.closeBtn = this.createUIButton(262, 90, 28, 28, "X", (function(){
            this.hideOverlay();
          }).bind(this), this.overlayGroup);
        },

        createUIButton: function(x, y, w, h, label, onClick, parentGroup) {
          var g = game.add.graphics(0,0, parentGroup || this.overlayGroup);
          g.beginFill(0x0F4C81, 1);
          g.lineStyle(2, 0x1C6FB5, 1);
          g.drawRoundedRect(x, y, w, h, 8);
          g.endFill();
          g.inputEnabled = true;
          g.input.useHandCursor = true;
          g.events.onInputUp.add(onClick, this);

          var t = game.add.bitmapText(x + 10, y + 6, "ArialBlackWhite", label, 20, parentGroup || this.overlayGroup);
          t.height = 24;

          return { box:g, label:t };
        },

        showOverlay: function(title) {
          this.createOverlayRoot();
          this.overlayTitle.setText(title || "");
          // Clear old content
          this.overlayTextGroup.removeAll(true);
          // Pause physics
          game.physics.box2d.pause();
          this.overlayGroup.visible = true;
        },

        hideOverlay: function() {
          if (!this.overlayGroup) return;
          this.overlayGroup.visible = false;
          // Resume physics only if not in a “stopped” state due to game over without resuming
          if (!this.gameOver) {
            game.physics.box2d.resume();
          }
        },

        // ============================
        // === NEW: Leaderboard UI  ===
        // ============================
        showLeaderboard: function() {
          this.showOverlay("Leaderboard");
          var loading = game.add.bitmapText(40, 140, "ArialBlackWhite", "Loading...", 22, this.overlayTextGroup);
          loading.height = 26;

          httpGetJSON(LEADERBOARD_URL).then((function(data){
            loading.setText("");

            var scores = (data && data.scores) ? data.scores : [];
            if (!scores.length) {
              loading.setText("No scores yet.");
              return;
            }

            var y = 150;
            var header = game.add.bitmapText(40, y, "ArialBlackWhite", "Rank   Name                 Score", 20, this.overlayTextGroup);
            header.height = 24;
            y += 28;

            for (var i=0; i<Math.min(10, scores.length); i++) {
              var rank = (i+1)+".".padEnd(5, " ");
              var name = (scores[i].name || "Anonymous");
              if (name.length > 18) name = name.slice(0,18)+"…";
              name = (name).padEnd(21, " ");
              var line = rank + name + (scores[i].score || 0);
              var row = game.add.bitmapText(40, y, "ArialBlackWhite", line, 20, this.overlayTextGroup);
              row.height = 24;
              y += 26;
            }

            // Refresh + Close buttons
            this.createUIButton(40, 440, 100, 36, "Refresh", this.showLeaderboard.bind(this));
            this.createUIButton(180, 440, 100, 36, "Close", this.hideOverlay.bind(this));

          }).bind(this)).catch((function(err){
            loading.setText("Failed to load.");
            console.error(err);
          }).bind(this));
        },

        // ==================================
        // === NEW: Game Over / Save Score ===
        // ==================================
        endGame: function() {
          // Freeze physics and show options
          this.showOverlay("Game Over");
          // Keep current score as "finalScore"
          var finalScore = this.scoreValue;

          var y0 = 160;
          var msg = game.add.bitmapText(40, y0, "ArialBlackWhite", "Your score: " + finalScore, 22, this.overlayTextGroup);
          msg.height = 26;

          // Buttons
          this.createUIButton(40, 220, 240, 40, "Play Again", (function(){
            this.hideOverlay();
            this.resetBallAndScore(true); // true => reset score to 0
          }).bind(this));

          this.createUIButton(40, 270, 240, 40, "Main Menu", (function(){
            // Leave overlay and go back
            this.gameOver = false; // so physics can resume in menu
            this.hideOverlay();
            game.state.start("Pinball.Menu", Phaser.Plugin.StateTransition.Out.SlideRight);
          }).bind(this));

          this.createUIButton(40, 320, 240, 40, "Save Score", (function(){
            var name = window.prompt("Enter your name for the leaderboard:", "") || "Anonymous";
            var payload = { name: name, score: finalScore };
            var savingText = game.add.bitmapText(40, 380, "ArialBlackWhite", "Saving...", 20, this.overlayTextGroup);
            savingText.height = 24;

            httpPostJSON(LEADERBOARD_URL, payload).then((function(resp){
              savingText.setText("Saved!");
              // Optionally show leaderboard straight away
              game.time.events.add(600, (function(){ this.showLeaderboard(); }).bind(this));
            }).bind(this)).catch((function(err){
              savingText.setText("Failed to save.");
              console.error(err);
            }).bind(this));
          }).bind(this));

          // Keep gameOver true until user chooses something
          this.gameOver = true;
        },

        resetBallAndScore: function(resetScore) {
          // Reset score if requested
          if (resetScore) { this.updateScore(0); }

          // Restore ball to starting position
          this.ballBody.x = this.ballStart[0]*this.PTM;
          this.ballBody.y = this.ballStart[1]*this.PTM;
          this.ballBody.velocity.x = 0;
          this.ballBody.velocity.y = 0;
          this.ballBody.angularVelocity = 0;

          // Lower flippers to default
          this.leftFlipper.angle = 27;
          this.rightFlipper.angle = -27;

          // Resume play
          this.gameOver = false;
          game.physics.box2d.resume();
        },

        render: function()
// =====================
// === NEW: CONFIGS  ===
// =====================
var LEADERBOARD_URL = "https://script.google.com/macros/s/AKfycbz5pBJY9qeYThLk1GGDAXAibEey9_hazpRi3PbaY3MuU0h2_1tr8OfSrzTa5IUJMj0/exec";

// Basic fetch helpers with XHR fallback (to handle older browsers)
function httpGetJSON(url) {
  if (window.fetch) {
    return fetch(url, { method: "GET" }).then(r => r.json());
  }
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch(e){ reject(e); }
      }
    };
    xhr.onerror = reject;
    xhr.send();
  });
}

function httpPostJSON(url, bodyObj) {
  if (window.fetch) {
    return fetch(url, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(bodyObj)
    }).then(r => r.json());
  }
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch(e){ reject(e); }
      }
    };
    xhr.onerror = reject;
    xhr.send(JSON.stringify(bodyObj));
  });
}

