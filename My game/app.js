const mainState = {
  addPipe: function () {
    const pipeHolePosition = game.rnd.between(50, 430 - this.pipeHole);

    const upperPipe = this.pipes.create(320, pipeHolePosition - 480, 'pipe');
    game.physics.arcade.enable(upperPipe);
    upperPipe.body.velocity.x = -this.playerSpeed;
    upperPipe.events.onOutOfBounds.add((pipe) => {
      pipe.destroy();
    });

    const lowerPipe = this.pipes.create(320, pipeHolePosition + this.pipeHole, 'pipe');
    game.physics.arcade.enable(lowerPipe);
    lowerPipe.body.velocity.x = -this.playerSpeed;
    lowerPipe.events.onOutOfBounds.add((pipe) => {
      pipe.destroy();
    });

    this.playerJustCrossedPipes = false;
  },

  create: function () {
    game.add.tileSprite(0, 0, 350, 490, 'background');
    game.stage.disableVisibilityChange = true;

    this.player = game.add.sprite(80, 240,'player');
    this.player.scale.setTo(0.4,0.4);
    this.player.anchor.set(0.5);
    this.playerSpeed = 125;
    this.playerFlapPower = 300;
    this.playerJustCrossedPipes = false;
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 800;

    this.flapSound = game.add.audio('flap');

    this.pipes = game.add.group();
    this.pipeHole = 120;
    this.addPipe();

    this.score = 0;
    this.scoreText = game.add.text(175, 20, '0', { font: '30px Arial', fill: '#ffffff' });

    game.input.onDown.add(this.flap, this);
    game.time.events.loop(2000, this.addPipe, this);
  },

  die: function () {
    game.state.start('main');
  },

  flap: function () {
    this.flapSound.play();
    this.player.body.velocity.y = -this.playerFlapPower;
  },

  preload: function () {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('player', 'assets/player.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.image('background', 'assets/background.png');
    game.load.audio('flap', 'assets/jump.mp3');
  },

  update: function () {
    game.physics.arcade.overlap(this.player, this.pipes, this.die, null, this);
    if (this.player.y > game.height) {
      this.die();
    }
    this.pipes.forEach((pipe) => {
      if (this.playerJustCrossedPipes === false && pipe.alive && pipe.x + pipe.width < this.player.x) {
        this.playerJustCrossedPipes = true;
        this.updateScore();
      }
    });
  },

  updateScore: function () {
    this.score = this.score + 1;
    this.scoreText.text = `${this.score}`;
  }
};

const game = new Phaser.Game(350, 490,);
game.state.add('main', mainState);
game.state.start('main');
