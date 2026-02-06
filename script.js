let timer=0;
let interval;
let activeCell=null;
let boardCells=[];
let runs=[];

/* HIDDEN SOLUTION GRID (only white cells matter) */

const solution = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,3,4,5,6,7,8,9,1,2,3,4,5,6,7,0,0],
[0,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,0],
[0,5,6,7,0,0,1,2,3,0,0,4,5,6,0,0,7,0],
[0,6,7,8,0,1,2,3,0,4,5,6,0,7,8,9,0,1],
[0,7,8,9,0,2,3,4,0,5,6,7,0,8,9,1,0,2],
[0,8,9,1,0,0,4,5,6,0,0,7,8,9,0,0,1,0],
[0,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,0],
[0,1,2,3,4,5,0,0,6,7,0,0,8,9,1,2,3,0],
[0,2,3,4,5,6,0,0,7,8,0,0,9,1,2,3,4,0],
[0,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0],
[0,4,5,6,0,0,9,1,2,0,0,3,4,5,0,0,6,0],
[0,5,6,7,0,8,9,1,0,2,3,4,0,5,6,7,0,8],
[0,6,7,8,0,9,1,2,0,3,4,5,0,6,7,8,0,9],
[0,7,8,9,0,0,2,3,4,0,0,5,6,7,0,0,8,0],
[0,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,0],
[0,0,2,3,4,5,6,7,8,9,1,2,3,4,5,6,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

/* SAME LAYOUT AS BEFORE */
const layout = window.layout;

/* START GAME */
function startGame(){
  const name=document.getElementById("playerName").value.trim();
  if(name===""){ alert("Enter your name"); return; }

  document.getElementById("startScreen").style.display="none";
  document.getElementById("gameArea").style.display="block";

  buildBoard();
  detectRuns();
  assignClues();
  startTimer();
}

/* TIMER */
function startTimer(){
  interval=setInterval(()=>{
    timer++;
    let m=Math.floor(timer/60).toString().padStart(2,'0');
    let s=(timer%60).toString().padStart(2,'0');
    document.getElementById("timer").innerText=`Time: ${m}:${s}`;
  },1000);
}

/* BUILD BOARD */
function buildBoard(){
  const board=document.getElementById("board");
  board.innerHTML="";
  const table=document.createElement("table");

  boardCells=[];

  layout.forEach((row,r)=>{
    const tr=document.createElement("tr");
    boardCells[r]=[];

    row.forEach((cell,c)=>{
      const td=document.createElement("td");

      if(cell==="B"){
        td.className="black";
      }
      else if(cell==="C"){
        td.className="clue";
        td.innerHTML=`<span class="across"></span><span class="down"></span>`;
      }
      else{
        td.className="white";
        const input=document.createElement("input");
        input.addEventListener("click",()=>{ activeCell=input; });
        td.appendChild(input);
        td.inputRef=input;
      }

      tr.appendChild(td);
      boardCells[r][c]=td;
    });

    table.appendChild(tr);
  });

  board.appendChild(table);
}

/* DETECT RUNS */
function detectRuns(){
  runs=[];
  const size=18;

  for(let r=0;r<size;r++){
    for(let c=0;c<size;c++){
      if(layout[r][c]==="W"){

        if(c===0 || layout[r][c-1]!=="W"){
          let run=[];
          let cc=c;
          while(cc<size && layout[r][cc]==="W"){
            run.push({r, c:cc});
            cc++;
          }
          if(run.length>1) runs.push({cells:run, dir:"across"});
        }

        if(r===0 || layout[r-1][c]!=="W"){
          let run=[];
          let rr=r;
          while(rr<size && layout[rr][c]==="W"){
            run.push({r:rr, c});
            rr++;
          }
          if(run.length>1) runs.push({cells:run, dir:"down"});
        }

      }
    }
  }
}

/* ASSIGN CLUES FROM SOLUTION */
function assignClues(){
  runs.forEach(run=>{
    let sum=0;
    run.cells.forEach(cell=>{
      sum+=solution[cell.r][cell.c];
    });

    const first=run.cells[0];

    if(run.dir==="across"){
      const clueCell=boardCells[first.r][first.c-1];
      if(clueCell && clueCell.className==="clue"){
        clueCell.querySelector(".across").innerText=sum;
      }
    }
    else{
      const clueCell=boardCells[first.r-1][first.c];
      if(clueCell && clueCell.className==="clue"){
        clueCell.querySelector(".down").innerText=sum;
      }
    }
  });
}

/* VALIDATE */
function submitPuzzle(){

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

    let clueSum=0;
    const first=run.cells[0];

    if(run.dir==="across"){
      clueSum=parseInt(boardCells[first.r][first.c-1]
      .querySelector(".across").innerText);
    }
    else{
      clueSum=parseInt(boardCells[first.r-1][first.c]
      .querySelector(".down").innerText);
    }

    if(sum!==clueSum) return showResult("Incorrect sum");
  }

  showResult("Correct!");
}

/* RESULT DISPLAY */
function showResult(msg){
  let res=document.getElementById("resultMessage");
  if(!res){
    res=document.createElement("p");
    res.id="resultMessage";
    document.getElementById("gameArea").appendChild(res);
  }
  res.innerText=msg;
}

/* NUMBER PAD */
function insertNumber(num){
  if(activeCell) activeCell.value=num;
}

function clearCell(){
  if(activeCell) activeCell.value="";
}
