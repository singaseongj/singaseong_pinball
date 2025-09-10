                this.nameInputCancel.input.useHandCursor = true;
                this.nameInputCancel.events.onInputUp.add(this.cancelNameInput, this);
                this.nameInputOverlay.add(this.nameInputCancel);
        showGameOverOverlay: function()
                {
                this.gameOverActive = true;
                this.gameOverScore.setText("SCORE: " + this.scoreValue);
                this.gameOverOverlay.visible = true;

                // PAUSE PHYSICS
                game.physics.box2d.pause();

                // SHOW NAME INPUT OVERLAY AUTOMATICALLY
                this.showNameInput();
                },
        hideNameInput: function()
                {
                this.nameInputActive = false;
                this.nameInputOverlay.visible = false;
                // DISABLE KEYBOARD INPUT
                game.input.keyboard.removeCallbacks();
                },

        cancelNameInput: function()
                {
                this.hideNameInput();
                game.state.start("Pinball.Menu");
                },
        submitScore: function()
                {
                if (this.playerName.trim().length === 0)
                        {
                        // SHOW ERROR OR JUST RETURN
                        return;
                        }
                var scoreData = {
                        name: this.playerName.trim(),
                        score: this.scoreValue
                };
                // SUBMIT TO LEADERBOARD
                this.postToLeaderboard(scoreData);
                this.hideNameInput();

                // SHOW LEADERBOARD THEN RETURN TO MENU
                game.state.start("Pinball.Leaderboard", Phaser.Plugin.StateTransition.Out.SlideLeft, false, true);
                },
        init: function(autoReturn)
                {
                this.autoReturn = autoReturn || false;
                },

        create: function()
                {
                // LOAD LEADERBOARD DATA
                this.loadLeaderboard();

                // AUTOMATICALLY RETURN TO MENU IF REQUESTED
                if (this.autoReturn)
                        {
                        game.time.events.add(5000, function()
                                {
                                game.state.start("Pinball.Menu");
                                }, this);
                        }
                },
