function setDifficulty() {
    document.getElementById('board').innerHTML = "<div class='board__position corner'>1</div><div class='board__position edge'>2</div><div class='board__position corner'>3</div><div class='board__position edge'>4</div><div class='board__position center'>5</div><div class='board__position edge'>6</div><div class='board__position corner'>7</div><div class='board__position edge'>8</div><div class='board__position corner'>9</div>";

    stillPlaying = true;
    voidPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, true];
    selectedPositionsU = [];
    selectedPositionsM = [];
    for (let i of positions) {
        for (let j in i) {
            if (i[j].innerText in voidPositions) {
                i[j].addEventListener('click', play);
            }
        }
    }
    voidPositions.pop();
}

function play(event) {
    if (difficulty.value == 'easy') {
        modeEasy(event);
    }
    else if (difficulty.value == 'impossible') {
        modeEasy(event);
    }
    else if (difficulty.value == 'friend') {

    }

}

function modeEasy(event) {
    if (stillPlaying) {
        picked = event.path[0];
        selectedPositionsU.push(Number(picked.innerText));
        voidPositions.splice(voidPositions.indexOf(selectedPositionsU.reverse()[0]), 1);
        picked.innerHTML = "<div class='x'>X</div>";
        picked.removeEventListener('click', play);
        validateWin(selectedPositionsU);
    }

    if (stillPlaying) {
        setTimeout(function () {
            let machine = easySelection();
            selectedPositionsM.push(machine);
            voidPositions.splice(voidPositions.indexOf(machine), 1);
            for (let i of positions) {
                for (let j of i) {
                    if (j.innerText == String(machine)) {
                        j.innerHTML = "<div class='o'>O</div>";
                        j.removeEventListener('click', play);
                        validateWin(selectedPositionsM);
                    }
                }
            }
        }, 400);
    }
}

function easySelection() {
    let number = Math.ceil(Math.random() * 9)
    if (voidPositions.indexOf(number) != -1) {
        return number;
    }
    else {
        return easySelection();
    }
}

function validateWin(selections) {
    for (let sumPattern = 1; sumPattern <= 4; sumPattern++) {
        for (let i of selections) {
            j = i + sumPattern;
            k = j + sumPattern;
            if (sumPattern >= 3) {
                if (selections.indexOf(i) != -1 && selections.indexOf(j) != -1 && selections.indexOf(k) != -1) {
                    stillPlaying = false;
                    gameOver(selections);
                    break;
                }
            }
            else if(sumPattern < 3){
                if(selections.indexOf(i) != -1 && selections.indexOf(j) != -1 && selections.indexOf(k) != -1 && ((i+j+k) == 6 || (i+j+k) == 15 || (i+j+k) == 24)){
                    stillPlaying = false;
                    gameOver(selections);
                    break;
                }
            }
        }
    }
    if (voidPositions.length == 0 && stillPlaying) {
        stillPlaying = false;
        gameOver('Tie!');
    }
}

function gameOver(who) {
    setTimeout(function () { setDifficulty(); }, 2500);
    if (who == selectedPositionsU) {
        who = 'You win!';
    }
    else if (who == selectedPositionsM) {
        who = 'Losser!';
    }
    positions[2][0].innerHTML += '<p class="winner">' + who + '</p>';
    console.log('Ganador: ' + who);
    console.log('GAME OVER');
}

let corners = document.getElementsByClassName('corner');
let edges = document.getElementsByClassName('edge');
let center = document.getElementsByClassName('center');
let positions = [corners, edges, center];

let voidPositions, selectedPositionsU, selectedPositionsM;
let stillPlaying;

let diffculty = document.getElementById('difficulty');
diffculty.addEventListener('change', setDifficulty);
setDifficulty();

/*  -Poner los numeros pequeños y transparentes
    -Poner un boton de restart con la misma funcion de setDifficulty
    -Tal ve< dibujar la linea cuando alguine gana con canvas */