let timer=0;
let interval;
let activeCell=null;

let boardCells=[];
let runs=[];

/* 18x18 Layout (~70% white) */
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
["B","B","C","C","C","C","C","C","C","C","C","C","C","C","C","C","B","B"]
];

function startGame(){
  const name=document.getElementById("playerName").value.trim();
  if(name===""){ alert("Enter your name"); return; }

  document.getElementById("startScreen").style.display="none";
  document.getElementById("gameArea").style.display="block";

  buildBoard();
  detectRuns();
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
        input.addEventListener("click",()=>{
          activeCell=input;
        });
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

/* RUN DETECTION */

function detectRuns(){
  runs=[];

  const size=18;

  for(let r=0;r<size;r++){
    for(let c=0;c<size;c++){

      const cell=boardCells[r][c];

      if(cell.className==="white"){

        /* Horizontal run start */
        if(c===0 || boardCells[r][c-1].className!=="white"){

          let run=[];
          let cc=c;

          while(cc<size && boardCells[r][cc].className==="white"){
            run.push(boardCells[r][cc]);
            cc++;
          }

          if(run.length>1){
            runs.push({cells:run, direction:"across"});
          }
        }

        /* Vertical run start */
        if(r===0 || boardCells[r-1][c].className!=="white"){

          let run=[];
          let rr=r;

          while(rr<size && boardCells[rr][c].className==="white"){
            run.push(boardCells[rr][c]);
            rr++;
          }

          if(run.length>1){
            runs.push({cells:run, direction:"down"});
          }
        }

      }
    }
  }

  console.log("Total runs detected:", runs.length);
}

/* NUMBER PAD */

function insertNumber(num){
  if(activeCell) activeCell.value=num;
}

function clearCell(){
  if(activeCell) activeCell.value="";
}

/* DRAG PAD */

const pad=document.getElementById("numberPad");
const header=document.getElementById("padHeader");
let offsetX, offsetY, isDragging=false;

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

document.onmouseup=()=>{ isDragging=false; };

function togglePad(){
  const body=document.querySelector(".pad-body");
  body.style.display=body.style.display==="none"?"block":"none";
}
let padScale = 1;

function resizePad(direction){
  padScale += direction * 0.1;

  if(padScale < 0.6) padScale = 0.6;
  if(padScale > 1.8) padScale = 1.8;

  pad.style.transform = `scale(${padScale})`;
}
