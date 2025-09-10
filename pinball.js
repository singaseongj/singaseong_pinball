(() => {
  // plugins
  Matter.use(MatterAttractors);

  // constants
  const PATHS = {
    DOME: '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20 303.9 25.7 338.3 36.9 370.5 53.3 399.8 74.6 425.4 100.2 446.7 129.5 463.1 161.7 474.3 196.1 480 231.9 480 250 500 250 500 0 0 0',
    DROP_LEFT: '0 0 20 0 70 100 20 150 0 150 0 0',
    DROP_RIGHT: '50 0 68 0 68 150 50 150 0 100 50 0',
    APRON_LEFT: '0 0 180 120 0 120 0 0',
    APRON_RIGHT: '180 0 180 120 0 120 180 0'
  };
  const COLOR = {
    BACKGROUND: '#212529',
    OUTER: '#495057',
    INNER: '#15aabf',
    BUMPER: '#fab005',
    BUMPER_LIT: '#fff3bf',
    PADDLE: '#e64980',
    PINBALL: '#dee2e6'
  };
  const GRAVITY = 0.75;
  const WIREFRAMES = false;
  const BUMPER_BOUNCE = 1.5;
  const PADDLE_PULL = 0.002;
  const MAX_VELOCITY = 50;
  const LEADERBOARD_URL = 'https://script.google.com/macros/s/AKfycbz5pBJY9qeYThLk1GGDAXAibEey9_hazpRi3PbaY3MuU0h2_1tr8OfSrzTa5IUJMj0/exec';

  // score elements
  let $currentScore = $('.current-score span');
  let $highScore = $('.high-score span');

  // shared variables
  let currentScore, highScore;
  let engine, world, render, pinball, stopperGroup;
  let leftPaddle, leftUpStopper, leftDownStopper, isLeftPaddleUp;
  let rightPaddle, rightUpStopper, rightDownStopper, isRightPaddleUp;
  let bottomReset, shooterReset;
  let isSpringCharging, springStartTime;

  function load() {
    init();
    createStaticBodies();
    createPaddles();
    createPinball();
    createEvents();
  }

  function init() {
    engine = Matter.Engine.create();
    world = engine.world;
    world.bounds = {
      min: { x: 0, y: 0 },
      max: { x: 500, y: 800 }
    };
    world.gravity.y = GRAVITY;

    render = Matter.Render.create({
      element: $('.container')[0],
      engine: engine,
      options: {
        width: world.bounds.max.x,
        height: world.bounds.max.y,
        wireframes: WIREFRAMES,
        background: COLOR.BACKGROUND
      }
    });
    Matter.Render.run(render);

    let runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    stopperGroup = Matter.Body.nextGroup(true);

    currentScore = 0;
    highScore = 0;
    $highScore.text(highScore);
    showLeaderboard();
    isLeftPaddleUp = false;
    isRightPaddleUp = false;
    isSpringCharging = false;
    springStartTime = 0;
  }

  function createStaticBodies() {
    bottomReset = reset(225, 50);
    shooterReset = reset(465, 30);
    Matter.World.add(world, [
      boundary(250, -30, 500, 100),
      boundary(250, 830, 500, 100),
      boundary(-30, 400, 100, 800),
      boundary(530, 400, 100, 800),
      path(239, 86, PATHS.DOME),
      wall(140, 140, 20, 40, COLOR.INNER),
      wall(225, 140, 20, 40, COLOR.INNER),
      wall(310, 140, 20, 40, COLOR.INNER),
      bumper(105, 250),
      bumper(225, 250),
      bumper(345, 250),
      bumper(165, 340),
      bumper(285, 340),
      wall(440, 520, 20, 560, COLOR.OUTER),
      path(25, 360, PATHS.DROP_LEFT),
      path(425, 360, PATHS.DROP_RIGHT),
      wall(120, 510, 20, 120, COLOR.INNER),
      wall(330, 510, 20, 120, COLOR.INNER),
      wall(60, 529, 20, 160, COLOR.INNER),
      wall(390, 529, 20, 160, COLOR.INNER),
      wall(93, 624, 20, 98, COLOR.INNER, -0.96),
      wall(357, 624, 20, 98, COLOR.INNER, 0.96),
      path(79, 740, PATHS.APRON_LEFT),
      path(371, 740, PATHS.APRON_RIGHT),
      bottomReset,
      shooterReset
    ]);
  }

  function createPaddles() {
    leftUpStopper = stopper(160, 591, 'left', 'up');
    leftDownStopper = stopper(140, 743, 'left', 'down');
    rightUpStopper = stopper(290, 591, 'right', 'up');
    rightDownStopper = stopper(310, 743, 'right', 'down');
    Matter.World.add(world, [leftUpStopper, leftDownStopper, rightUpStopper, rightDownStopper]);

    let paddleGroup = Matter.Body.nextGroup(true);

    let paddleLeft = {};
    paddleLeft.paddle = Matter.Bodies.trapezoid(170, 660, 20, 80, 0.33, {
      label: 'paddleLeft',
      angle: 1.57,
      chamfer: {},
      render: { fillStyle: COLOR.PADDLE }
    });
    paddleLeft.brick = Matter.Bodies.rectangle(172, 672, 40, 80, {
      angle: 1.62,
      chamfer: {},
      render: { visible: false }
    });
    paddleLeft.comp = Matter.Body.create({
      label: 'paddleLeftComp',
      parts: [paddleLeft.paddle, paddleLeft.brick]
    });
    paddleLeft.hinge = Matter.Bodies.circle(142, 660, 5, {
      isStatic: true,
      render: { visible: false }
    });
    Object.values(paddleLeft).forEach(piece => {
      piece.collisionFilter.group = paddleGroup;
    });
    paddleLeft.con = Matter.Constraint.create({
      bodyA: paddleLeft.comp,
      pointA: { x: -29.5, y: -8.5 },
      bodyB: paddleLeft.hinge,
      length: 0,
      stiffness: 0
    });
    Matter.World.add(world, [paddleLeft.comp, paddleLeft.hinge, paddleLeft.con]);
    Matter.Body.rotate(paddleLeft.comp, 0.57, { x: 142, y: 660 });

    let paddleRight = {};
    paddleRight.paddle = Matter.Bodies.trapezoid(280, 660, 20, 80, 0.33, {
      label: 'paddleRight',
      angle: -1.57,
      chamfer: {},
      render: { fillStyle: COLOR.PADDLE }
    });
    paddleRight.brick = Matter.Bodies.rectangle(278, 672, 40, 80, {
      angle: -1.62,
      chamfer: {},
      render: { visible: false }
    });
    paddleRight.comp = Matter.Body.create({
      label: 'paddleRightComp',
      parts: [paddleRight.paddle, paddleRight.brick]
    });
    paddleRight.hinge = Matter.Bodies.circle(308, 660, 5, {
      isStatic: true,
      render: { visible: false }
    });
    Object.values(paddleRight).forEach(piece => {
      piece.collisionFilter.group = paddleGroup;
    });
    paddleRight.con = Matter.Constraint.create({
      bodyA: paddleRight.comp,
      pointA: { x: 29.5, y: -8.5 },
      bodyB: paddleRight.hinge,
      length: 0,
      stiffness: 0
    });
    Matter.World.add(world, [paddleRight.comp, paddleRight.hinge, paddleRight.con]);
    Matter.Body.rotate(paddleRight.comp, -0.57, { x: 308, y: 660 });
  }

  function createPinball() {
    pinball = Matter.Bodies.circle(0, 0, 14, {
      label: 'pinball',
      collisionFilter: { group: stopperGroup },
      render: { fillStyle: COLOR.PINBALL }
    });
    Matter.World.add(world, pinball);
    launchPinball();
  }

  function createEvents() {
    Matter.Events.on(engine, 'collisionStart', function(event) {
      let pairs = event.pairs;
      pairs.forEach(function(pair) {
        if (pair.bodyB.label === 'pinball') {
          switch (pair.bodyA.label) {
            case 'reset':
              if (pair.bodyA === bottomReset) {
                gameOver();
              } else {
                launchPinball();
              }
              break;
            case 'bumper':
              pingBumper(pair.bodyA);
              break;
          }
        }
      });
    });

    Matter.Events.on(engine, 'beforeUpdate', function() {
      Matter.Body.setVelocity(pinball, {
        x: Math.max(Math.min(pinball.velocity.x, MAX_VELOCITY), -MAX_VELOCITY),
        y: Math.max(Math.min(pinball.velocity.y, MAX_VELOCITY), -MAX_VELOCITY)
      });
      if (pinball.position.x > 450 && pinball.velocity.y > 0) {
        Matter.Body.setVelocity(pinball, { x: 0, y: -10 });
      }
    });

    Matter.World.add(world, Matter.MouseConstraint.create(engine, {
      mouse: Matter.Mouse.create(render.canvas),
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    }));

    $('body').on('keydown', function(e) {
      if (e.which === 90) {
        isLeftPaddleUp = true;
      } else if (e.which === 191) {
        isRightPaddleUp = true;
      } else if (e.which === 32 && !isSpringCharging) {
        isSpringCharging = true;
        springStartTime = Date.now();
      }
    });
    $('body').on('keyup', function(e) {
      if (e.which === 90) {
        isLeftPaddleUp = false;
      } else if (e.which === 191) {
        isRightPaddleUp = false;
      } else if (e.which === 32 && isSpringCharging) {
        let charge = Math.min((Date.now() - springStartTime) * 0.02, 30);
        Matter.Body.setVelocity(pinball, { x: 0, y: -10 - charge });
        isSpringCharging = false;
      }
    });

    $('.left-trigger')
      .on('mousedown touchstart', function() { isLeftPaddleUp = true; })
      .on('mouseup touchend', function() { isLeftPaddleUp = false; });
    $('.right-trigger')
      .on('mousedown touchstart', function() { isRightPaddleUp = true; })
      .on('mouseup touchend', function() { isRightPaddleUp = false; });
  }

  function launchPinball() {
    updateScore(0);
    Matter.Body.setPosition(pinball, { x: 465, y: 765 });
    Matter.Body.setVelocity(pinball, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(pinball, 0);
  }

  function pingBumper(bumper) {
    updateScore(currentScore + 10);
    bumper.render.fillStyle = COLOR.BUMPER_LIT;
    setTimeout(function() {
      bumper.render.fillStyle = COLOR.BUMPER;
    }, 100);
  }

  function updateScore(newCurrentScore) {
    currentScore = newCurrentScore;
    $currentScore.text(currentScore);
    highScore = Math.max(currentScore, highScore);
    $highScore.text(highScore);
  }

  function gameOver() {
    $('#game-over').removeClass('hidden');
    showLeaderboard();
    Matter.World.remove(world, pinball);
  }

  $('#submit-score').on('click', function() {
    let name = $('#player-name').val().trim();
    if (name) {
      fetch(LEADERBOARD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score: currentScore })
      })
        .then(() => {
          $('#player-name').val('');
          $('#game-over').addClass('hidden');
          showLeaderboard();
          createPinball();
        })
        .catch(err => console.error('Error submitting score:', err));
    }
  });

  function showLeaderboard() {
    fetch(LEADERBOARD_URL)
      .then(res => res.json())
      .then(data => {
        let list = $('#leaderboard-list');
        list.empty();
        data.scores.forEach(s => {
          list.append(`<li>${s.name}: ${s.score}</li>`);
        });
        highScore = data.scores[0]?.score || 0;
        $highScore.text(highScore);
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function boundary(x, y, width, height) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: { fillStyle: COLOR.OUTER }
    });
  }

  function wall(x, y, width, height, color, angle = 0) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      angle: angle,
      isStatic: true,
      chamfer: { radius: 10 },
      render: { fillStyle: color }
    });
  }

  function path(x, y, path) {
    let vertices = Matter.Vertices.fromPath(path);
    return Matter.Bodies.fromVertices(x, y, vertices, {
      isStatic: true,
      render: {
        fillStyle: COLOR.OUTER,
        strokeStyle: COLOR.OUTER,
        lineWidth: 1
      }
    });
  }

  function bumper(x, y) {
    let bumper = Matter.Bodies.circle(x, y, 25, {
      label: 'bumper',
      isStatic: true,
      render: { fillStyle: COLOR.BUMPER }
    });
    bumper.restitution = BUMPER_BOUNCE;
    return bumper;
  }

  function stopper(x, y, side, position) {
    let attracteeLabel = side === 'left' ? 'paddleLeftComp' : 'paddleRightComp';
    return Matter.Bodies.circle(x, y, 40, {
      isStatic: true,
      render: { visible: false },
      collisionFilter: { group: stopperGroup },
      plugin: {
        attractors: [function(a, b) {
          if (b.label === attracteeLabel) {
            let isPaddleUp = side === 'left' ? isLeftPaddleUp : isRightPaddleUp;
            let isPullingUp = position === 'up' && isPaddleUp;
            let isPullingDown = position === 'down' && !isPaddleUp;
            if (isPullingUp || isPullingDown) {
              return {
                x: (a.position.x - b.position.x) * PADDLE_PULL,
                y: (a.position.y - b.position.y) * PADDLE_PULL
              };
            }
          }
        }]
      }
    });
  }

  function reset(x, width) {
    return Matter.Bodies.rectangle(x, 781, width, 2, {
      label: 'reset',
      isStatic: true,
      render: { fillStyle: '#fff' }
    });
  }

  load();
})();
