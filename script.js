/* ================= CONFIG ================= */

const SIZE = 18;
let timer = 0;
let interval;
let locked = false;
let activeInput = null;
let undoStack = [];
const lockKey = "arithmosSolved";

/* ================= SAMPLE SOLUTION (VALID) ================= */
/* 0 = non white cell */

const solution = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,4,7,8,0,6,9,0,3,8,0,5,2,0,7,1,0],
[0,8,3,6,5,2,7,4,1,9,6,3,8,2,5,4,7,0],
[0,9,5,0,7,8,0,6,4,0,1,7,0,9,6,0,3,0],
[0,0,6,4,9,7,3,8,2,5,4,6,7,3,8,9,0,0],
[0,7,8,2,1,0,6,9,5,4,0,8,3,6,2,7,9,0],
[0,3,9,0,8,5,4,0,7,6,1,0,9,5,4,0,8,0],
[0,0,2,8,6,3,9,4,1,7,5,2,8,6,3,4,0,0],
[0,6,1,5,0,9,7,0,3,2,0,4,9,0,1,8,5,0],
[0,4,7,0,2,6,0,8,9,0,3,5,0,7,4,0,2,0],
[0,0,8,6,4,1,5,3,7,9,2,8,6,4,1,5,0,0],
[0,9,2,3,7,0,8,1,6,5,0,9,4,2,7,6,3,0],
[0,5,4,0,9,8,6,0,2,1,7,0,5,8,6,0,4,0],
[0,0,3,9,5,4,2,7,8,6,1,3,9,5,4,7,0,0],
[0,7,6,1,0,2,9,0,4,3,0,8,2,0,9,6,1,0],
[0,2,8,0,6,7,0,5,3,0,4,1,0,6,8,0,7,0],
[0,0,9,4,7,3,8,6,2,1,5,4,7,3,9,8,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

/* ================= START GAME ================= */

function startGame(){
  const name = document.getElementById("playerName").value.trim();
  if(name === ""){
    alert("Enter your name");
    return;
  }

  if(localStorage.getItem(lockKey)){
    alert("Already solved on this device.");
    return;
  }

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
  const container=document.getElementById("board");
  container.innerHTML="";
  const table=document.createElement("table");

  for(let r=0;r<SIZE;r++){
    const tr=document.createElement("tr");

    for(let c=0;c<SIZE;c++){
      const td=document.createElement("td");

      if(solution[r][c] !== 0){
        td.className="white";
        const input=document.createElement("input");
        input.maxLength=1;

        input.addEventListener("focus",()=>activeInput=input);

        input.addEventListener("input",function(){
          this.value=this.value.replace(/[^1-9]/g,"");
          undoStack.push({cell:this,value:this.value});
        });

        td.appendChild(input);
      }
      else{
        td.className="clue";
        td.innerHTML='<span class="across"></span><span class="down"></span>';
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  container.appendChild(table);
}

/* ================= GENERATE CLUES ================= */

function generateClues(){
  const table=document.querySelector("#board table");

  for(let r=0;r<SIZE;r++){
    for(let c=0;c<SIZE;c++){

      if(solution[r][c]===0){

        // RIGHT
        if(c+1<SIZE && solution[r][c+1]!==0){
          let sum=0, cc=c+1;
          while(cc<SIZE && solution[r][cc]!==0){
            sum+=solution[r][cc];
            cc++;
          }
          table.rows[r].cells[c].querySelector(".across").innerText=sum;
        }

        // DOWN
        if(r+1<SIZE && solution[r+1][c]!==0){
          let sum=0, rr=r+1;
          while(rr<SIZE && solution[rr][c]!==0){
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

  for(let r=0;r<SIZE;r++){
    for(let c=0;c<SIZE;c++){
      if(solution[r][c]!==0){
        const input=table.rows[r].cells[c].querySelector("input");
        if(!input.value || parseInt(input.value)!==solution[r][c]){
          document.getElementById("resultMessage").innerText="Incorrect.";
          return;
        }
      }
    }
  }

  locked=true;
  clearInterval(interval);
  localStorage.setItem(lockKey,"true");

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

/* ================= CONTROLS ================= */

function insertNumber(num){
  if(activeInput && !locked){
    activeInput.value=num;
  }
}

function clearCell(){
  if(activeInput) activeInput.value="";
}

function clearBoard(){
  document.querySelectorAll(".white input").forEach(i=>i.value="");
}

function undoMove(){
  const last=undoStack.pop();
  if(last) last.cell.value="";
}

function togglePad(){
  const body=document.querySelector(".pad-body");
  body.style.display = body.style.display==="none" ? "block" : "none";
}

/* ================= DRAG PAD ================= */

const pad=document.getElementById("numberPad");
let offsetX, offsetY, dragging=false;

if(pad){
  pad.addEventListener("mousedown",e=>{
    dragging=true;
    offsetX=e.clientX-pad.offsetLeft;
    offsetY=e.clientY-pad.offsetTop;
  });

  document.addEventListener("mousemove",e=>{
    if(dragging){
      pad.style.left=(e.clientX-offsetX)+"px";
      pad.style.top=(e.clientY-offsetY)+"px";
    }
  });

  document.addEventListener("mouseup",()=>dragging=false);
}
