function loadJSON(callback) {

    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../drinking-game/test.json', true);
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

    startButton.addEventListener('click', startGame);
    startButton.challenges = challenges;
});

function startGame(evt) {
    const challengeTitleEle = document.getElementsByClassName('challenge-title')[0];
    const turnsLeftEle = document.getElementsByClassName('turns-left')[0];
    const challengeDescriptionEle = document.getElementsByClassName('challenge-description')[0];

    let challenges = evt.currentTarget.challenges.slice();
    let isPaused = false;

    turnsLeftEle.innerHTML = `${challenges.length} пъти остават`;

    evt.currentTarget.style.display = 'none';
    challengeTitleEle.style.display = 'block';

    let wordsChangeInterval = setInterval(wordsChange, 150, challengeTitleEle, challenges);

    challengeTitleEle.addEventListener('click', function () {
        if (isPaused) {
            challengeDescriptionEle.parentElement.parentElement.style.display = 'none';

            wordsChangeInterval = setInterval(wordsChange, 150, challengeTitleEle, challenges);
        }
        else {
            const currentChallengeTitle = challengeTitleEle.innerHTML;
            const currentChallenge = challenges.find(challenge => challenge.title === currentChallengeTitle);
            const currentChallengeIndex = challenges.indexOf(challenge => challenge.title === currentChallengeTitle);

            challenges.splice(currentChallengeIndex, 1);

            challengeDescriptionEle.innerHTML = currentChallenge.description;
            challengeDescriptionEle.parentElement.parentElement.style.display = 'block';

            clearInterval(wordsChangeInterval);
        }

        turnsLeftEle.innerHTML = `${challenges.length} ${challenges.length === 1 ? 'път остава' : 'пъти остават'}`;
        isPaused = !isPaused;
    });

}

function wordsChange(challengeTitleEle, challenges) {
    challengeTitleEle.innerHTML = challenges[Math.floor(Math.random() * challenges.length)].title;
}

