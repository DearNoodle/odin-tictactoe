const game = (function(){
    let gameBoard = ['','','',
                      '','','',
                      '','',''];

    let player1 = {
        name: 'Player 1',
        isUser: true,
        marker: 'x',
    };

    let player2 = {
        name: 'Player 2',
        isUser: true,
        marker: 'o',
    };

    const winCombinations = [[0,1,2],[3,4,5],[6,7,8],
                             [0,3,6],[1,4,7],[2,5,6],
                             [0,4,8],[2,4,6]]

    let roundNumber = 0;
    let isGameEnded = false;
    let AIPlaying = false;

    const userDataModule = document.querySelector('.user-data-module');
    const gameModule = document.querySelector('.game-module');

    const userDataForm = document.querySelector('form.player-data');
    const buttonsSelect = document.querySelectorAll('.select-player');
    const buttonStart = document.querySelector('.start');
    const buttonRestart = document.querySelector('.restart');
    const grids = document.querySelectorAll('.grid-container > div');
    const gameText = document.querySelector('.text-display');

    const init = function() {
        bindEvent();
        gameRender();
    }

    const bindEvent = function() {
        buttonsSelect.forEach(buttonSelect => { 
            buttonSelect.addEventListener('click',(event) => selectPlayer(event));
        });
        buttonStart.addEventListener('click',startGame);

        buttonRestart.addEventListener('click', () => location.reload());
        for (let i = 0; i < grids.length; i++) {
            grids[i].addEventListener('click', (event) => userPlayRound(event))
        }
    }

    const selectPlayer = function(event) {
        const btn = event.target;
        const input = document.querySelector(`input.${btn.classList[1]}`);
        if (btn.innerText === 'User') {
            btn.innerText = 'AI';
            btn.nextElementSibling.classList.add('hide');
            input.value = 'AI';
            
        } else {
            btn.innerText = 'User';
            btn.nextElementSibling.classList.remove('hide');
            input.value = input.defaultValue;
        }
    }

    const startGame = function() {
        getPlayerData();
        userDataForm.reset();
        gameModule.classList.remove('hide');
        userDataModule.classList.add('hide');
        if (player1.isUser === 'AI') {
            AIPlayRound();
        }
    }

    const getPlayerData = function(){
        player1.isUser = document.querySelector('#p1-is-user').innerText;
        player2.isUser = document.querySelector('#p2-is-user').innerText;
        player1.name = document.querySelector('#p1-name').value;
        player2.name = document.querySelector('#p2-name').value;
    }

    const gameRender = function(){    
        for (let i = 0; i < grids.length; i++) {
            grids[i].textContent = gameBoard[i];
        }
    }

    const userPlayRound = function(event){
        if (!(event.target.innerText) && !AIPlaying) {
            if (!isGameEnded) {
                const i = event.target.id.slice(-1);
                roundNumber%2 === 0 ? placeMarker(i, player1.marker) : placeMarker(i, player2.marker);
            }
        }
    }

    const AIPlayRound = function(){
        let i;
        AIPlaying = true;
        if (!isGameEnded) {
            while (gameBoard[i] !== '') {
                i = Math.floor(Math.random() * 9);
            }
            roundNumber%2 === 0 
            ? setTimeout(function() {placeMarker(i, player1.marker); AIPlaying = false;}, 50) 
            : setTimeout(function() {placeMarker(i, player2.marker); AIPlaying = false;}, 50);
        }
    }
    const placeMarker = function(i, marker){
        gameBoard[i] = marker;
        checkWinner();
        gameRender();
        roundNumber++;
        if (roundNumber%2 === 0) {
            if (player1.isUser === 'AI') {
                AIPlayRound();
            }
        } else {
            if (player2.isUser === 'AI') {
                AIPlayRound();
            }
        }
    }

    const checkWinner = function(){
        for (let i = 0; i < winCombinations.length; i++) {
            let winCombination = winCombinations[i];
            let winChecker = '';
            for (let j = 0; j < winCombination.length; j++) {
                winChecker += gameBoard[winCombination[j]];
                if (winChecker === 'xxx' || winChecker === 'ooo') {
                    playerWin(winChecker);
                    return;
                }
            }
        }
    }

    const playerWin = function(winChecker) {
        const winner = (winChecker === 'xxx') ? player1.name : player2.name;
        gameText.innerText = `Winner is ${winner}`;
        isGameEnded = true;
    }

    init();

    return {
    };
})()
