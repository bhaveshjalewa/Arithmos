/* ================= CONFIG ================= */

const ROWS = 12;
const COLS = 10;

let timer = 0;
let interval;
let activeInput = null;
let locked = false;
let undoStack = [];

/* ================= LAYOUT ================= */

const layoutText = [
"BBCCBCCCBB",
"BCWWCWWWCB",
"BCWWWWWWWC",
"CWWWWCCWWW",
"CWWWWWCWWW",
"BCCWWWWCWW",
"CWWCWWWCWW",
"CWWCWWWWCC",
"CWWWCWWWWW",
"CWWWCCWWWW",
"BCWWWWWWWB",
"BBCWWWCWWB"
];

/* ================= SOLUTION ================= */

const solution = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,7,1,0,1,3,7,0,0],
[0,0,6,5,2,3,7,9,1,0],
[0,3,8,2,1,0,0,8,9,4],
[0,8,9,6,3,1,0,4,2,1],
[0,0,0,9,4,2,1,0,6,2],
[0,3,6,0,5,6,2,0,8,3],
[0,4,9,0,6,8,3,1,0,0],
[0,2,4,9,0,9,4,8,6,1],
[0,1,2,8,0,0,7,9,8,5],
[0,0,1,2,4,3,5,7,9,0],
[0,0,0,3,9,8,0,5,1,0]
];

/* ================= START ================= */

function startGame(){
  document.getElementById("startScreen").style.display="none";
  document.getElementById("gameArea").style.display="block";
  buildBoard();
  generateClues();
  startTimer();
}

/* ================= TIMER ================= */

function startTimer(){
  interval=setInterval(()=>{
    timer++;
    let m=Math.floor(timer/60).toString().padStart(2,'0');
    let s=(timer%60).toString().padStart(2,'0');
    document.getElementById("timer").innerText=`Time: ${m}:${s}`;
  },1000);
}

/* ================= BUILD BOARD ================= */

function buildBoard(){
  const board=document.getElementById("board");
  board.innerHTML="";
  const table=document.createElement("table");

  for(let r=0;r<ROWS;r++){
    const tr=document.createElement("tr");

    for(let c=0;c<COLS;c++){
      const td=document.createElement("td");

      const type = layoutText[r][c];

      if(type==="W"){
        td.className="white";

        const input=document.createElement("input");
        input.maxLength=1;

        input.addEventListener("focus",()=>activeInput=input);

        input.addEventListener("input",function(){
          this.value=this.value.replace(/[^1-9]/g,"");
          undoStack.push({cell:this});
        });

        td.appendChild(input);
      }
      else if(type==="C"){
        td.className="clue";
        td.innerHTML='<span class="across"></span><span class="down"></span>';
      }
      else{
        td.className="black";
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  board.appendChild(table);
}

/* ================= GENERATE CLUES ================= */

function generateClues(){
  const table=document.querySelector("#board table");

  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){

      if(layoutText[r][c]==="C"){

        // ACROSS
        if(c+1<COLS && layoutText[r][c+1]==="W"){
          let sum=0;
          let cc=c+1;
          while(cc<COLS && layoutText[r][cc]==="W"){
            sum+=solution[r][cc];
            cc++;
          }
          table.rows[r].cells[c].querySelector(".across").innerText=sum;
        }

        // DOWN
        if(r+1<ROWS && layoutText[r+1][c]==="W"){
          let sum=0;
          let rr=r+1;
          while(rr<ROWS && layoutText[rr][c]==="W"){
            sum+=solution[rr][c];
            rr++;
          }
          table.rows[r].cells[c].querySelector(".down").innerText=sum;
        }

      }

    }
  }
}

/* ================= SUBMIT ================= */

function submitPuzzle(){
  const table=document.querySelector("#board table");

  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){

      if(layoutText[r][c]==="W"){

        const input = table.rows[r].cells[c].querySelector("input");
        const val = parseInt(input.value);

        if(val !== solution[r][c]){
          document.getElementById("resultMessage").innerText="Incorrect.";
          return;
        }

      }

    }
  }

  clearInterval(interval);
  locked=true;
  document.getElementById("resultMessage").innerText=
  "Correct! Code: "+generateCode();
}

/* ================= CODE ================= */

function generateCode(){
  const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let code="";
  for(let i=0;i<52;i++){
    code+=chars[Math.floor(Math.random()*chars.length)];
  }
  return code;
}

/* ================= UNDO ================= */

function undoMove(){
  const last=undoStack.pop();
  if(last) last.cell.value="";
}

/* ================= CLEAR ================= */

function clearBoard(){
  document.querySelectorAll(".white input").forEach(i=>i.value="");
}

/* ================= NUMBER PAD ================= */

function insertNumber(num){
  if(activeInput) activeInput.value=num;
}

function clearCell(){
  if(activeInput) activeInput.value="";
}
