/* ================= CONFIG ================= */

const ROWS = 12;
const COLS = 10;

let timer = 0;
let interval;
let activeInput = null;
let locked = false;
let undoStack = [];

/* ================= ENCODED SOLUTION ================= */
/* Original solution encoded to hide direct visibility */

const encodedSolution =
"WzAsMCwwLDAsMCwwLDAsMCwwLDBdLFswLDAsNywxLDAsMSwzLDcsMCwwXSxbMCwwLDYsNSwyLDMsNyw5LDEsMF0sWzAsMyw4LDIsMSwwLDAsOCw5LDRdLFswLDgsOSw2LDMsMSwwLDQsMiwxXSxbMCwwLDAsOSw0LDIsMSwwLDYsMl0sWzAsMyw2LDAsNSw2LDIsMCw4LDNdLFswLDQsOSwwLDYsOCwzLDEsMCwwXSxbMCwyLDQsOSwwLDksNCw4LDYsMV0sWzAsMSwyLDgsMCwwLDcsOSw4LDVdLFswLDAsMSwyLDQsMyw1LDcsOSwwXSxbMCwwLDAsMyw5LDgsMCw1LDEsMF0=";

const solution = JSON.parse("[" + atob(encodedSolution) + "]");

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
  interval = setInterval(()=>{
    timer++;
    let m = Math.floor(timer/60).toString().padStart(2,'0');
    let s = (timer%60).toString().padStart(2,'0');
    document.getElementById("timer").innerText=`Time: ${m}:${s}`;
  },1000);
}

/* ================= BUILD BOARD ================= */

function buildBoard(){
  const board = document.getElementById("board");
  board.innerHTML="";
  const table = document.createElement("table");

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
          undoStack.push(this);
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
  if(locked) return;

  const table=document.querySelector("#board table");

  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){

      if(layoutText[r][c]==="W"){
        const input=table.rows[r].cells[c].querySelector("input");
        const val=parseInt(input.value);

        if(val!==solution[r][c]){
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

/* ================= FIXED CODE ================= */

function generateCode(){

  const encryptedCode =
  "WjlAdkwjM3hUITdxUiQybVBeOHlXKjRrQiAlMWRGJjZuSD8wY0orNXNVPUUhYVg=";

  return atob(encryptedCode);

}

/* ================= UNDO ================= */

function undoMove(){
  const last=undoStack.pop();
  if(last) last.value="";
}

/* ================= CLEAR ================= */

function clearBoard(){
  document.querySelectorAll(".white input").forEach(i=>i.value="");
}

/* ================= NUMBER PAD ================= */

function insertNumber(num){
  if(activeInput && !locked){
    activeInput.value=num;
  }
}

function clearCell(){
  if(activeInput && !locked){
    activeInput.value="";
  }
}

/* ================= DRAG NUMBER PAD ================= */

const pad=document.getElementById("numberPad");
const header=document.getElementById("padHeader");

if(header){
  let offsetX, offsetY, dragging=false;

  header.addEventListener("mousedown",(e)=>{
    dragging=true;
    offsetX=e.clientX-pad.offsetLeft;
    offsetY=e.clientY-pad.offsetTop;
  });

  document.addEventListener("mousemove",(e)=>{
    if(dragging){
      pad.style.left=(e.clientX-offsetX)+"px";
      pad.style.top=(e.clientY-offsetY)+"px";
      pad.style.bottom="auto";
      pad.style.right="auto";
    }
  });

  document.addEventListener("mouseup",()=>dragging=false);
}

/* ================= MINIMIZE PAD ================= */

const toggleBtn=document.getElementById("toggleBtn");
const padBody=document.getElementById("padBody");

if(toggleBtn){
  toggleBtn.addEventListener("click",()=>{
    if(padBody.style.display==="none"){
      padBody.style.display="block";
      toggleBtn.textContent="–";
    } else {
      padBody.style.display="none";
      toggleBtn.textContent="+";
    }
  });
}
