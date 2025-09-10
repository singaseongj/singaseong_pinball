            this.state.start("Pinball.Game");
                game.physics.box2d.gravity.y = 3500; // LARGE GRAVITY TO MAKE SCENE FEEL SMALLER
                this.ballBody.setFixtureContactCallback(this.gutterFixture1, function()
                        {
                        this.gameOver = true;
                        game.paused = true;
                        window.onGameOver(this.scoreValue);
                        }, this);
                this.ballBody.setFixtureContactCallback(this.gutterFixture2, function()
                        {
                        this.gameOver = true;
                        game.paused = true;
                        window.onGameOver(this.scoreValue);
                        }, this);
                // CHECKING IF THE GAME IS OVER
                if(this.gameOver==true)
                        {
                        return;
                        }
                // UPDATING THE SCORE WITH THE NEW VALUE
                this.scoreValue = newScore;
                window.currentScore = newScore;
// EXPOSE START/STOP FUNCTIONS
window.startPinball = function() {
  game.paused = false;
  game.state.start("Pinball.Preloader");
};
window.restartGame = function() {
  game.paused = false;
  game.state.start("Pinball.Game");
};
window.stopGame = function() {
  game.paused = true;
};
