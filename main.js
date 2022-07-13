function setDifficulty() {
    document.getElementById('board').innerHTML = '<div class="board__position board__position1 corner">1</div><div class="board__position board__position2 edge">2</div><div class="board__position board__position3 corner">3</div><div class="board__position board__position4 edge">4</div><div class="board__position board__position5 center">5</div><div class="board__position board__position6 edge">6</div><div class="board__position board__position7 corner">7</div><div class="board__position board__position8 edge">8</div><div class="board__position board__position9 corner">9</div>';

    stillPlaying = true;
    friendCount = 1;
    voidPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, true];
    selectedPositionsU = [];
    selectedPositionsM = [];
    for (let i of positions) {
        for (let j in i) {
            if (i[j].innerText in voidPositions) {
                if(screen. width < 800){
                    i[j].addEventListener('touchstart', play);
                }
                else {
                    i[j].addEventListener('click', play);
                }
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
        console.log(event);
        modeImpossible(event);
    }
    else if (difficulty.value == 'friend') {
        modeFriend(event);
    }

}

function userMove(picked) {
    selectedPositionsU.push(Number(picked.innerText));
    voidPositions.splice(voidPositions.indexOf(selectedPositionsU.reverse()[0]), 1);
    picked.innerHTML = "<div class='x'>X</div>";
    picked.removeEventListener('click', play);
}

function machineMove(machine) {
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
}

function friendMove(picked, who){
    who.push(Number(picked.innerText));
    voidPositions.splice(voidPositions.indexOf(who.reverse()[0]), 1);
    if(who == selectedPositionsU){
        picked.innerHTML = "<div class='x'>X</div>";
    }
    else if(who == selectedPositionsM){
        picked.innerHTML = "<div class='o'>O</div>";
    }
    picked.removeEventListener('click', play);
}

function modeFriend(event){
    if (stillPlaying) {
        if(friendCount % 2 == 0){
            friendMove(event.path[0], selectedPositionsM);
            validateWin(selectedPositionsM);
        }
        else {
            friendMove(event.path[0], selectedPositionsU);
            validateWin(selectedPositionsU);
        }
        friendCount++;
    }
}

function modeEasy(event) {
    if (stillPlaying) {
        userMove(event.path[0]);
        validateWin(selectedPositionsU);
    }

    if (stillPlaying) {
        let machine = easySelection();
        machineMove(machine);
        
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

function modeImpossible(event) {
    if (stillPlaying) {
        userMove(event.path[0]);
        validateWin(selectedPositionsU);
    }

    if (stillPlaying) {
        let machine = impossibleSelection(selectedPositionsU);
        machineMove(machine);
    }
}

function impossibleSelection(used) {
    if (used.length == 1) {
        /* When user starts on corner */
        if (used[0] % 2 != 0 && used[0] != 5) {
            where = setImpossible(used[0]);
            return 5;
        }
        /* When user starts on edge */
        else if (used[0] % 2 == 0) {
            where = setImpossible(used[0]);
            return where[1][0];
        }
        /* When user starts on center */
        else if (used[0] == 5) {
            where = setImpossible(used[0]);
            return 7;
        }
    }
    if (used.length > 1) {
        let win = almostWin(selectedPositionsM);
        let block = almostWin(used);
        let trick = analyzeImpossible(used);
        if (win[1]) {
            return win[0];
        }
        else if (block[1]) {
            return block[0];
        }
        else if (trick[1]) {
            return trick[0];
        }
        else {
            return easySelection();
        }
    }
}

function setImpossible(x) {
    let oppCorners, adjCorners, adjEdges, oppEdges;
    let setCenter = 5;

    switch (x) {
        case 1:
            oppCorners = [9];
            adjCorners = [3, 7];
            oppEdges = [6, 8];
            adjEdges = [2, 4];
            break;
        case 2:
            oppCorners = [7, 9];
            adjCorners = [1, 3];
            oppEdges = [8];
            adjEdges = [4, 6];
            break;
        case 3:
            oppCorners = [7];
            adjCorners = [1, 9];
            oppEdges = [4, 8];
            adjEdges = [2, 6];
            break;
        case 4:
            oppCorners = [3, 9];
            adjCorners = [1, 7];
            oppEdges = [8];
            adjEdges = [2, 8];
            break;
        case 5:
            oppCorners = [1, 3, 7, 9];
            break;
        case 6:
            oppCorners = [1, 7];
            adjCorners = [3, 9];
            oppEdges = [4];
            adjEdges = [2, 8];
            break;
        case 7:
            oppCorners = [3];
            adjCorners = [1, 9];
            oppEdges = [2, 6];
            adjEdges = [4, 8];
            break;
        case 8:
            oppCorners = [1, 3];
            adjCorners = [7, 9];
            oppEdges = [2];
            adjEdges = [4, 6];
            break;
        case 9:
            oppCorners = [1];
            adjCorners = [3, 7];
            oppEdges = [2, 4];
            adjEdges = [6, 8];
            break;
    }
    return [oppCorners, adjCorners, setCenter, oppEdges, adjEdges];
}

function almostWin(used) {
    for (let j = 1; j <= 4; j++) {
        for (let k = 1; k <= 7;) {
            if (j == 2) {
                k = 3;
            }
            if (used.indexOf(k) != -1 && used.indexOf(k + j) != -1) {
                if (voidPositions.indexOf((k + (2 * j))) != -1) {
                    return [(k + (2 * j)), true];
                }
            }
            else if (used.indexOf(k) != -1 && used.indexOf(k + (2 * j)) != -1) {
                if (voidPositions.indexOf((k + j)) != -1) {
                    return [(k + j), true];
                }
            }
            else if (used.indexOf(k + j) != -1 && used.indexOf(k + (2 * j)) != -1) {
                if (voidPositions.indexOf((k)) != -1) {
                    return [(k), true];
                }
            }
            if (j == 1) {
                k += 3;
            }
            else if (j == 2) {
                break;
            }
            else if (j == 3) {
                k++;
                if (k > 3) {
                    break;
                }
            }
            else if (j == 4) {
                return ['idk', false];
            }
        }
    }
}

function analyzeImpossible(user) {
    /* CORNER: */
    if (where[0].length == 1) {
        if (user.length == 2) {
            if (user[0] == where[0] || user[0] == where[3][0]) {
                return [where[4][0], true];
            }
            else if (user[0] == where[3][1]) {
                return [where[4][1], true];
            }
        }
        else if (user.length == 3) {
            if (user[0] == where[3][1]) {
                return [where[1][1], true];
            }
            else if (user[0] == where[3][0]) {
                return [where[1][0], true];
            }
        }
        else {
            return ['idk', false];
        }
    }
    /* EDGE: */
    else if (where[0].length == 2) {
        if (user.length == 2) {
            if (user[0] == where[1][1] || user[0] == where[4][0] || user[0] == where[4][1] || user[0] == where[0][0] || user[0] == where[0][1]) {
                return [5, true];
            }
        }
        else {
            return ['idk', false];
        }

    }
    /* CENTER: */
    else if(where[0].length == 4){
        if(user.length == 2){
            if(user[0] == where[0][1]){
                return [where[0][3], true];
            }
        }
        else {
            return ['idk', false];
        }
    }
}

function validateWin(selections) {
    for (let sumPattern = 1; sumPattern <= 4; sumPattern++) {
        for (let i of selections) {
            j = i + sumPattern;
            k = j + sumPattern;
            if (sumPattern >= 3) { /* Vertical and 1 diagonal */
                if (selections.indexOf(i) != -1 && selections.indexOf(j) != -1 && selections.indexOf(k) != -1) {
                    stillPlaying = false;
                    gameOver(selections, [i, j, k]);
                    break;
                }
            }
            else if (sumPattern < 3) { /* Horizontal and 1 diagonal */
                if (selections.indexOf(i) != -1 && selections.indexOf(j) != -1 && selections.indexOf(k) != -1 && ((i + j + k) == 6 || (i + j + k) == 15 || (i + j + k) == 24)) {
                    stillPlaying = false;
                    gameOver(selections, [i, j, k]);
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

function gameOver(who, numbers) {
    let winner = false;
    if (who == selectedPositionsU) {
        who = 'X<br>Winner!';
        winner = true;
    }
    else if (who == selectedPositionsM) {
        who = 'O<br>Winner!';
        winner = true;
    }

    if(winner){
        if(numbers[1] % 2 == 0){
            if(numbers[1] == 2){
                edges[0].innerHTML += '<div class="h-line"></div>';
            }
            else if(numbers[1] == 8){
                edges[3].innerHTML += '<div class="h-line"></div>';
            }
            else if(numbers[1] == 4){
                edges[1].innerHTML += '<div class="v-line"></div>';
            }
            else if(numbers[1] == 6){
                edges[2].innerHTML += '<div class="v-line"></div>';
            }
        }
        else if(numbers[1] == 5){
            if(numbers[2] == 6){
                center[0].innerHTML += '<div class="h-line"></div>';
            }
            else if(numbers[2] == 8){
                center[0].innerHTML += '<div class="v-line"></div>';
            }
            else if(numbers[2] == 9){
                center[0].innerHTML += '<div class="d-line1"></div>';
            }
            else if(numbers[2] == 7){
                center[0].innerHTML += '<div class="d-line2"></div>';
            }
        }
        
    }
    setTimeout(function(){
        document.getElementById('board').innerHTML = '<p class="winner" onclick="setDifficulty()">' + who + '</p>';
    }, 1500)
}

let corners = document.getElementsByClassName('corner');
let edges = document.getElementsByClassName('edge');
let center = document.getElementsByClassName('center');
let positions = [corners, edges, center];

let voidPositions, selectedPositionsU, selectedPositionsM;
let where;
let friendCount;
let stillPlaying;

let diffculty = document.getElementById('difficulty');
diffculty.addEventListener('change', setDifficulty);
setDifficulty();