let isPaused = false;
let wordsChangeInterval;
const challengeTitleEle = document.getElementsByClassName('challenge-title')[0];
const turnsLeftEle = document.getElementsByClassName('turns-left')[0];
const challengeDescriptionEle = document.getElementsByClassName('challenge-description')[0];
let saveChallenges = [];

function loadJSON(callback) {

    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../drinking-game/challenges.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadJSON(function (response) {
    const startButton = document.getElementsByClassName('start-button')[0];
    const challenges = JSON.parse(response);
    saveChallenges = challenges;

    startButton.addEventListener('click', startGame, false);
    startButton.challenges = challenges;
});

function startGame(evt) {
    let challenges = evt.currentTarget.challenges.slice();
    const buttons = document.getElementsByClassName('buttons')[0];

    turnsLeftEle.innerHTML = `${challenges.length} пъти остават`;

    buttons.style.display = 'none';
    challengeTitleEle.style.display = 'block';

    wordsChangeInterval = setInterval(wordsChange, 150, challengeTitleEle, challenges);

    if(challengeDescriptionEle.parentElement.parentElement.style.display === 'block'){
        challengeDescriptionEle.parentElement.parentElement.style.display = 'none';
    }

    challengeTitleEle.addEventListener('click', getChallengeDescription.bind(null, challenges), false);
    challengeDescriptionEle.addEventListener('click', getChallengeDescription.bind(null, challenges), false);
}

function getChallengeDescription(challenges) {
    if(challenges.length === 0){
        return;
    }

    if (isPaused) {
        challengeDescriptionEle.parentElement.parentElement.style.display = 'none';

        wordsChangeInterval = setInterval(wordsChange, 150, challengeTitleEle, challenges);
    }
    else {
        const currentChallengeTitle = challengeTitleEle.innerHTML;
        const currentChallenge = challenges.find(challenge => challenge.title === currentChallengeTitle);
        const currentChallengeIndex = challenges.findIndex(challenge => challenge.title === currentChallengeTitle);

        challenges.splice(currentChallengeIndex, 1);

        challengeDescriptionEle.innerHTML = currentChallenge.description;
        challengeDescriptionEle.parentElement.parentElement.style.display = 'block';

        clearInterval(wordsChangeInterval);
    }    

    turnsLeftEle.innerHTML = `${challenges.length} ${challenges.length === 1 ? 'път остава' : 'пъти остават'}`;
    isPaused = !isPaused;

    if(challenges.length === 0){
        isPaused = false;
        finishGame();
    }
}

function wordsChange(challengeTitleEle, challenges) {
    challengeTitleEle.innerHTML = challenges[Math.floor(Math.random() * challenges.length)].title;
}

function finishGame(){
    clearInterval(wordsChangeInterval);

    turnsLeftEle.innerHTML = 'Започнете отново?';

    turnsLeftEle.addEventListener('click', startGame);
    turnsLeftEle.challenges = saveChallenges.slice();

    return;
}

