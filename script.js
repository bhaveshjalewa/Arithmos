let timer=0;
let interval;
let activeCell=null;
let boardCells=[];
let runs=[];
let moveHistory=[];
let padScale=1;
let locked=false;

const layout = [
["B","B","C","C","C","C","C","C","C","C","C","C","C","C","C","C","B","B"],
["B","C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C","B"],
["C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C"],
["C","W","W","W","C","C","W","W","W","C","C","W","W","W","C","C","W","C"],
["C","W","W","W","C","W","W","W","C","W","W","W","C","W","W","W","C","W"],
["C","W","W","W","C","W","W","W","C","W","W","W","C","W","W","W","C","W"],
["C","W","W","W","C","C","W","W","W","C","C","W","W","W","C","C","W","C"],
["C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C"],
["C","W","W","W","W","W","C","C","W","W","C","C","W","W","W","W","W","C"],
["C","W","W","W","W","W","C","C","W","W","C","C","W","W","W","W","W","C"],
["C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C"],
["C","W","W","W","C","C","W","W","W","C","C","W","W","W","C","C","W","C"],
["C","W","W","W","C","W","W","W","C","W","W","W","C","W","W","W","C","W"],
["C","W","W","W","C","W","W","W","C","W","W","W","C","W","W","W","C","W"],
["C","W","W","W","C","C","W","W","W","C","C","W","W","W","C","C","W","C"],
["C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C"],
["B","C","W","W","W","W","W","W","W","W","W","W","W","W","W","W","C","B"],
["B","B","C","W","W","W","W","W","W","W","W","W","W","W","W","C","B","B"]
];

const solution = Array.from({length:18}, (_,r)=>
  Array.from({length:18}, (_,c)=>{
    if(layout[r][c]!=="W") return 0;
    return ((r*3 + c*5) % 9) + 1;
  })
);

function startGame(){
  if(localStorage.getItem("arithmosLocked")){
    alert("You already completed this puzzle.");
    return;
  }

  const name=document.getElementById("playerName").value.trim();
  if(!name){ alert("Enter name"); return; }

  document.getElementById("startScreen").style.display="none";
  document.getElementById("gameArea").style.display="block";

  buildBoard();
  detectRuns();
  assignClues();
  startTimer();
}

function startTimer(){
  interval=setInterval(()=>{
    timer++;
    let m=Math.floor(timer/60).toString().padStart(2,'0');
    let s=(timer%60).toString().padStart(2,'0');
    document.getElementById("timer").innerText=`Time: ${m}:${s}`;
  },1000);
}

function buildBoard(){
  const board=document.getElementById("board");
  board.innerHTML="";
  const table=document.createElement("table");
  boardCells=[];

  for(let r=0;r<18;r++){
    const tr=document.createElement("tr");
    boardCells[r]=[];

    for(let c=0;c<18;c++){
      const td=document.createElement("td");

      if(layout[r][c]==="B"){
        td.className="black";
      }
      else if(layout[r][c]==="C"){
        td.className="clue";
        td.innerHTML=`<span class="across"></span><span class="down"></span>`;
      }
      else{
        td.className="white";
      const input=document.createElement("input");
input.maxLength = 1;   // ONLY 1 DIGIT
input.addEventListener("input", function(){
  this.value = this.value.replace(/[^1-9]/g, "");
});

        input.addEventListener("click",()=> activeCell=input);
        td.appendChild(input);
        td.inputRef=input;
      }

      tr.appendChild(td);
      boardCells[r][c]=td;
    }

    table.appendChild(tr);
  }

  board.appendChild(table);
}

function detectRuns(){
  runs=[];
  for(let r=0;r<18;r++){
    for(let c=0;c<18;c++){
      if(layout[r][c]==="W"){
        if(c===0 || layout[r][c-1]!=="W"){
          let run=[];
          let cc=c;
          while(cc<18 && layout[r][cc]==="W"){
            run.push({r,c:cc});
            cc++;
          }
          if(run.length>1) runs.push({cells:run,dir:"across"});
        }
        if(r===0 || layout[r-1][c]!=="W"){
          let run=[];
          let rr=r;
          while(rr<18 && layout[rr][c]==="W"){
            run.push({r:rr,c});
            rr++;
          }
          if(run.length>1) runs.push({cells:run,dir:"down"});
        }
      }
    }
  }
}

function assignClues(){
  runs.forEach(run=>{
    let sum=0;
    run.cells.forEach(cell=> sum+=solution[cell.r][cell.c]);
    if(sum>55) sum=55;

    const first=run.cells[0];

    if(run.dir==="across"){
      const clueCell=boardCells[first.r][first.c-1];
      if(clueCell?.className==="clue")
        clueCell.querySelector(".across").innerText=sum;
    }
    else{
      const clueCell=boardCells[first.r-1][first.c];
      if(clueCell?.className==="clue")
        clueCell.querySelector(".down").innerText=sum;
    }
  });
}

function submitPuzzle(){
  if(locked) return;

  for(let run of runs){
    let values=[];
    let sum=0;

    for(let cell of run.cells){
      let val=boardCells[cell.r][cell.c].inputRef.value;
      if(val==="") return showResult("Fill all cells");
      val=parseInt(val);
      if(values.includes(val)) return showResult("Duplicate in run");
      values.push(val);
      sum+=val;
    }

    let clueSum;
    const first=run.cells[0];

    if(run.dir==="across"){
      clueSum=parseInt(boardCells[first.r][first.c-1]
      .querySelector(".across").innerText);
    } else {
      clueSum=parseInt(boardCells[first.r-1][first.c]
      .querySelector(".down").innerText);
    }

    if(sum!==clueSum) return showResult("Incorrect sum");
  }

  clearInterval(interval);
  locked=true;
  localStorage.setItem("arithmosLocked",true);

  const code=generateCode();
  showResult("Correct! Code: "+code);
}

function generateCode(){
  const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let code="";
  for(let i=0;i<52;i++){
    code+=chars[Math.floor(Math.random()*chars.length)];
  }
  return code;
}

function showResult(msg){
  document.getElementById("resultMessage").innerText=msg;
}

function insertNumber(num){
  if(locked) return;
  if(activeCell){
    moveHistory.push({cell:activeCell,value:activeCell.value});
    activeCell.value=num;
  }
}

function clearCell(){
  if(locked) return;
  if(activeCell){
    moveHistory.push({cell:activeCell,value:activeCell.value});
    activeCell.value="";
  }
}

function undoMove(){
  if(moveHistory.length===0) return;
  const last=moveHistory.pop();
  last.cell.value=last.value;
}

function clearBoard(){
  boardCells.forEach(row=>{
    row.forEach(cell=>{
      if(cell.inputRef) cell.inputRef.value="";
    });
  });
  moveHistory=[];
}

function resizePad(dir){
  padScale+=dir*0.1;
  if(padScale<0.6) padScale=0.6;
  if(padScale>1.8) padScale=1.8;
  document.getElementById("numberPad").style.transform=`scale(${padScale})`;
}

function togglePad(){
  const body=document.querySelector(".pad-body");
  body.style.display=body.style.display==="none"?"block":"none";
}

const pad=document.getElementById("numberPad");
const header=document.getElementById("padHeader");
let offsetX,offsetY,isDragging=false;

header.onmousedown=(e)=>{
  isDragging=true;
  offsetX=e.clientX-pad.offsetLeft;
  offsetY=e.clientY-pad.offsetTop;
};

document.onmousemove=(e)=>{
  if(!isDragging) return;
  pad.style.left=(e.clientX-offsetX)+"px";
  pad.style.top=(e.clientY-offsetY)+"px";
  pad.style.bottom="auto";
  pad.style.right="auto";
};

document.onmouseup=()=> isDragging=false;
