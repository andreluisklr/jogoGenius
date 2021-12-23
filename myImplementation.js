const sound1 = new Audio('./0.wav');
const sound2 = new Audio('./2.wav');
const sounds = [sound1, sound2];

let frases = ['Legal!', 'Boa!!', 'Isso aí!!'];

let order = [];
let clickedOrder = [];
let score = 0;

const genius = document.querySelector('.genius');
const startButton = document.querySelector('.status__start');
const scoreHTML = document.querySelector('.status__score');

const modal = document.querySelector('.modal');
const modalMessage = document.querySelector('.modal__message');

scoreHTML.textContent = 'Score: ' + score;

/*
    0 - verde
    1 - vermelho
    2 - amarelo
    3 - azul
*/

const blue = document.querySelector('.blue');
const red = document.querySelector('.red');
const green = document.querySelector('.green');
const yellow = document.querySelector('.yellow');

let pads = [green, red, yellow, blue];

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';

    let padRandomIndex = Math.floor(Math.random() * 4);
    order.push(padRandomIndex);

    chamarModal('Iniciando...', 1)
    setTimeout(() => {
        modal.style.display = 'none';
        rodarSequencia();
    }, 3000)
});

function rodarSequencia(){
  const iterator = gerarIterator();

  function* gerarIterator(){
      for(let indexPad of order){
        setTimeout(() => {
            pads[indexPad].classList.add('selected');
            sounds[1].play();
        }, 500)

        setTimeout(() => {
            pads[indexPad].classList.remove('selected');
            let {done} = iterator.next();

            if(done == true){
                chamarModal('Sua vez!!!');
                setTimeout(jogador, 1000);
            }
        }, 1000)

        yield
      }
  }

  iterator.next();
}

function jogador(){
    const clickPad = (event) => {
        let isPad = event.target.classList.contains('pad');

        if(isPad){
            let pad = event.target;
            let indexPad = pads.indexOf(pad);

            clickedOrder.push(indexPad);

            sounds[0].play();

            pad.classList.add('selected');

            setTimeout(() => {
                pad.classList.remove('selected');
            }, 200)

            let ultimo = clickedOrder.length-1;

            if(clickedOrder[ultimo] !== order[ultimo]){
                genius.removeEventListener('click', clickPad);
                genius.style.cursor = '';
                chamarModal('você perdeu :(');
              
                clickedOrder = [];
                nextLevel(false);
            }else if(clickedOrder[ultimo] == order[ultimo] && clickedOrder.length === order.length){
                score++;
                scoreHTML.textContent = 'Score: ' + score;

                genius.removeEventListener('click', clickPad);
                genius.style.cursor = '';

                clickedOrder = [];

                if(score == 8){
                    fimDoJogo();
                }else{
                    nextLevel(true);
                }
            }
        }
    }

    genius.addEventListener('click', clickPad);
    genius.style.cursor = 'pointer';
}

function chamarModal(string, time = 2000){
    modalMessage.textContent = string;

    setTimeout(() => {
        modal.style.display = 'flex';
    }, 1000);

    setTimeout(() => {
        modal.style.display = 'none';
    }, time);
}

function nextLevel(bool){
    if(bool){
        let indexFrase = Math.floor(Math.random() * 3);
        chamarModal(frases[indexFrase]);
        
        let randomPad = Math.floor(Math.random() * 4); 
        order.push(randomPad);

        setTimeout(() => {
            rodarSequencia();
        }, 2000)
    }else{
        setTimeout(() => {
            rodarSequencia();
        }, 2000)
    }
}

function fimDoJogo(){
    clickedOrder = [];
    order = [];
    score = 0;

    chamarModal('Parabéns, você venceu o último nível, recarregue a página para jogar novamente', 30*60000);
}