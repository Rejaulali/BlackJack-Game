blackjack ={
    'you':{'spanescore':'#your-blackjack-score','div':'#your-box','score':0,'turn':0},
    'dealer':{'spanescore':'#dealer-blackjack-score','div':'#dealer-box','score':0,'turn':0},
    'card':['2','3','4','5','6','7','8','9','10','K','Q','J','A'],
    'cardtype':['C','D','H','S'],
    'cardmap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11],},
    'wins':0,
    'loses':0,
    'draws':0,
}

const YOU = blackjack['you'];
const DEALER = blackjack['dealer'];
let hitsound = new Audio('blackjack_assets/sounds/swish.m4a');
let winsound = new Audio('blackjack_assets/sounds/cash.mp3');
let losesound = new Audio('blackjack_assets/sounds/aww.mp3');
document.querySelector('#hit-blackjack-button').addEventListener('click',blackjackhit);
document.querySelector('#stand-blackjack-button').addEventListener('click',blackjackstand);
document.querySelector('#deal-blackjack-button').addEventListener('click',blackjacksdeal);

function blackjackhit(){
    
    if(YOU['turn']==0 ){
        let card = randomCard();
        let cardscore = computeScore(card,YOU);
        showCard(card, YOU);
        showScore(cardscore,YOU);
        
    }
    else
    {
        alert("you have played already, please click on Deal for next Game");
    }
}

function randomCard(){
    cardFistLet = blackjack['card'][Math.floor(Math.random()*13)];
    cardSecLet = blackjack['cardtype'][Math.floor(Math.random()*4)];
    return cardFistLet + cardSecLet;
}

function showCard(card, activPlayer){
    if(activPlayer['score'] <=21)
    {
        let cardImage = document.createElement('img');
        cardImage.src = `cards_png_zip/PNG/${card}.png`;
        document.querySelector(activPlayer['div']).appendChild(cardImage);
        hitsound.play();
    }
}
function computeScore(card,activPlayer){
    if(card[0] ==='A'){
        if(activPlayer['score'] + 11 <= 21){
            return 11;
        }
        else if(activPlayer['score'] + 11 > 21){
            return 1;
        }
    }
    else if(card[1] === '0'){
        
        return blackjack['cardmap'][card.slice(0,2)];
    }
    else{
        
        return blackjack['cardmap'][card[0]];
    }
}

function showScore(cardscore, activPlayer){
    activPlayer['score'] += cardscore;
    if(activPlayer['score'] > 21){
        document.querySelector(activPlayer['spanescore']).innerHTML = 'BUST!';
        document.querySelector(activPlayer['spanescore']).style.color = 'red';
        blackjackstand();
    }
    else{
        document.querySelector(activPlayer['spanescore']).innerHTML = activPlayer['score']
    }
    
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms))
}

async function blackjackstand(){
    
    YOU['turn'] = 1;
    cardimages = document.querySelector(YOU['div']).querySelectorAll('img');
    
    while(DEALER['turn'] == 0 && cardimages.length > 0 && DEALER['score'] < 16)
    {
        let card = randomCard();
        let cardscore = computeScore(card,DEALER);
        showCard(card, DEALER);
        showScore(cardscore,DEALER);
        await sleep(1000);       
    }
    if(DEALER['turn'] == 1){
        alert("you have played already, please click on Deal for next Game");
    }
    else if(cardimages.length == 0){
        YOU['turn'] = 0;
    }
    else{
        DEALER['turn'] = 1;
        winner = computeWinner();
        let msg ="";
        let color = "";
        if(winner === YOU)
        {
            msg = "YOU WON!" ;
            color = "green";
            winsound.play();
            
        }
        else if(winner === DEALER){
            msg = "YOU LOST";
            color = "red";
            losesound.play();
        }
        else{
            msg = "YOU DREW";
            color = "Orange";
            losesound.play();
        }
        document.querySelector('#result').innerHTML = msg;
        document.querySelector('#result').style.color = color;
        updateScoreBoard();
    }
    
}

function computeWinner(){
    let yourscore = YOU['score'];
    let dealerscore = DEALER['score'];
    if(yourscore <=21){
        if(yourscore > dealerscore || dealerscore >21){
            blackjack['wins']++;
            return YOU;
        }
        else if(yourscore < dealerscore && dealerscore <= 21){
            blackjack['loses']++;
            return DEALER;
        }
        else if(yourscore === dealerscore){
            blackjack['draws']++;
            return "";
        }
    }
    else if(yourscore >21 && dealerscore <= 21){
        blackjack['loses']++;
        return DEALER;
    }
    else if(yourscore > 21 && dealerscore > 21){
        blackjack['draws']++;
        return "";
    }
    
}

function blackjacksdeal(){
    if(DEALER['turn']==1){
        yourimages = document.querySelector(YOU['div']).querySelectorAll('img');
        dealerimages = document.querySelector(DEALER['div']).querySelectorAll('img');
        
        for(let i=0;i < yourimages.length;i++){
            yourimages[i].remove();
        }
        for(let j=0;j < dealerimages.length;j++){
            dealerimages[j].remove();
        }
        YOU['score'] = 0;
        YOU['turn'] = 0;
        DEALER['score'] = 0;
        DEALER['turn'] = 0;
        document.querySelector(YOU['spanescore']).innerHTML = YOU['score'];
        document.querySelector(YOU['spanescore']).style.color = 'white';

        document.querySelector(DEALER['spanescore']).innerHTML = DEALER['score'];
        document.querySelector(DEALER['spanescore']).style.color = 'white';

        document.querySelector('#result').innerHTML = "Let's Play";
        document.querySelector('#result').style.color = "black";

    }
}

function updateScoreBoard(){
    document.querySelector('#wins').innerHTML = blackjack['wins'];
    document.querySelector('#loses').innerHTML = blackjack['loses'];
    document.querySelector('#draws').innerHTML = blackjack['draws'];
    
}
