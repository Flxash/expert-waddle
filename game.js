let score = JSON.parse(localStorage.getItem('score')) || {
    wins: 0,
    losses: 0,
    ties: 0
  };

  updateScoreElement();

  /*
  if (!score) {
    score = {
      wins: 0,
      losses: 0,
      ties: 0
    };
  }
  */
  let gamesPlayed = score.wins + score.losses + score.ties;
  
  let playerMoveHistory = [0, 0, 0];

  const memoryFactor = 1;

  document.querySelector('.js-reset-button').addEventListener('click', () => {
    resetGame();
  });

  function resetGame(){
    score.wins = 0;
    score.losses = 0;
    score.ties = 0;
    localStorage.removeItem('score');
    updateScoreElement();
    gamesPlayed = 0;
    playerMoveHistory = [0, 0, 0];
  }

  document.querySelector('.js-auto-play-button').addEventListener('click', () => {
    autoPlay();
  });

  let isAutoPlaying = false;
  //let intervalId;
  let intervalIdStorage = [];

  function autoPlay() {
    if (!isAutoPlaying){
      intervalIdStorage.push(setInterval(() => {
        const playerMove = pickComputerMove();
        playGame(playerMove);
      }, 1000));
      isAutoPlaying = true;
    } else {
      intervalIdStorage.forEach((intervalId) => {
        clearInterval(intervalId);
      })
      isAutoPlaying = false;
    }
  }

  document.querySelector('.js-speed-up-button').addEventListener('click', () => {
    autoPlayInstances('increase');
  });

  document.querySelector('.js-speed-down-button').addEventListener('click', () => {
    autoPlayInstances('decrease');
  });

  function autoPlayInstances(effect) {
    if (isAutoPlaying){
      if (effect === 'increase'){
        intervalIdStorage.push(setInterval(() => {
          const playerMove = pickComputerMove();
          playGame(playerMove);
        }, 1000));
      } else if (effect === 'decrease') {
        const intervalId = intervalIdStorage.pop();
        clearInterval(intervalId);
        if (!intervalIdStorage.size){
          isAutoPlaying = false;
        }
      }
    }
  }

  document.querySelector('.js-rock-button').addEventListener('click', () => {
    playGame('rock');
  });

  document.querySelector('.js-paper-button').addEventListener('click', () => {
    playGame('paper');
  });

  document.querySelector('.js-scissors-button').addEventListener('click', () => {
    playGame('scissors');
  });

  document.body.addEventListener('keydown', (event) => {
    switch(event.key){
      case 'r':
        playGame('rock');
        break;
      case 'p':
        playGame('paper');
        break;
      case 's':
        playGame('scissors');
        break;
      case 'a':
        autoPlay();
        break;
    }
  });

  function playGame(playerMove) {
    const computerMove = pickComputerMove();

    let result = '';

    if (playerMove === 'scissors') {
      playerMoveHistory[2]++;
      if (computerMove === 'rock') {
        result = 'You lose.';
      } else if (computerMove === 'paper') {
        result = 'You win.';
      } else if (computerMove === 'scissors') {
        result = 'Tie.';
      }

    } else if (playerMove === 'paper') {
      playerMoveHistory[1]++;
      if (computerMove === 'rock') {
        result = 'You win.';
      } else if (computerMove === 'paper') {
        result = 'Tie.';
      } else if (computerMove === 'scissors') {
        result = 'You lose.';
      }
      
    } else if (playerMove === 'rock') {
      playerMoveHistory[0]++;
      if (computerMove === 'rock') {
        result = 'Tie.';
      } else if (computerMove === 'paper') {
        result = 'You lose.';
      } else if (computerMove === 'scissors') {
        result = 'You win.';
      }
    }

    if (result === 'You win.') {
      score.wins += 1;
    } else if (result === 'You lose.') {
      score.losses += 1;
    } else if (result === 'Tie.') {
      score.ties += 1;
    }

    localStorage.setItem('score', JSON.stringify(score));

    updateScoreElement();

    document.querySelector('.js-result').innerHTML = result;

    document.querySelector('.js-moves').innerHTML = ` You
    <img src="game-icons/${playerMove}-emoji.png" class="move-icon">
    <img src="game-icons/${computerMove}-emoji.png" class="move-icon">
    Computer`;
  }

  function updateScoreElement() {
    document.querySelector('.js-score')
      .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
  }

  function pickComputerMove() {
    let rockChance = Math.random();
    let paperChance = Math.random();
    let scissorChance = Math.random();


    if(gamesPlayed > 5){
        rockChance += (playerMoveHistory[2] / gamesPlayed) * memoryFactor;
        paperChance += (playerMoveHistory[0] / gamesPlayed) * memoryFactor;
        scissorChance += (playerMoveHistory[1] / gamesPlayed) * memoryFactor;
    }

    console.log(playerMoveHistory);

    let computerMove = '';

    if (rockChance > paperChance && rockChance >= scissorChance) {
      computerMove = 'rock';
    } else if (paperChance >= rockChance && paperChance > scissorChance) {
      computerMove = 'paper';
    } else if (scissorChance >= paperChance && scissorChance > rockChance) {
      computerMove = 'scissors';
    }

    console.log(playerMoveHistory);

    gamesPlayed++;

    return computerMove;
  }