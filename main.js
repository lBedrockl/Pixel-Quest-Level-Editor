var canvas = document.querySelector("canvas");

//volumes
var volumeContainer = document.querySelector(".volume-container");
var volumeSelection = document.querySelector(".volume-container_selection");
var volumeImage = document.querySelector("#volume-source");


//tiles
var tilesetContainer = document.querySelector(".tileset-container");
var tilesetSelection = document.querySelector(".tileset-container_selection");
var tilesetImage = document.querySelector("#tileset-source");

//3x3
var objectContainer = document.querySelector(".object-container");
var objectSelection = document.querySelector(".object-container_selection");
var objectImage = document.querySelector("#object-source");


var editorVer = '1.2.1';
document.getElementById("editorVersion").innerHTML = "v" + editorVer;
var currentSize = [1, 1];

var selection = [0, 0];
var selectionObj = [0, 0];
var selectionVol = [0, 0];

var isMouseDown = false;
var currentLayer = 0;
var layers = [
   //background
   {
      //Structure is "x-y": ["tileset_x", "tileset_y"]
      //EXAMPLE: "1-1": [3, 4],
   },
   //terrain
   {},
   //decal
   {},
   //objects
   {},
   //fringe
   {},
   //volumes
   {}
];

//Select tile from the Tiles grid
tilesetContainer.addEventListener("mousedown", (event) => {
   if(currentLayer == 3 || currentLayer == 5) setLayer(1)
   selection = getCoords(event, 16);
   tilesetSelection.style.left = selection[0] * 16 + "px";
   tilesetSelection.style.top = selection[1] * 16 + "px";
});

//select volume
volumeContainer.addEventListener("mousedown", (event) => {
    if(currentLayer != 5) setLayer(5)
    selectionVol = getCoords(event, 16);
    volumeSelection.style.left = selectionVol[0] * 16 + "px";
    volumeSelection.style.top = selectionVol[1] * 16 + "px";
 });

//Select object from the objects grid
objectContainer.addEventListener("mousedown", (event) => {
    if(currentLayer != 3) setLayer(3)
    selectionObj = getCoords(event, 48);
    objectSelection.style.left = selectionObj[0] * 48 + "px";
    objectSelection.style.top = selectionObj[1] * 48 + "px";
});

//Handler for placing new tiles on the map
function addTile(mouseEvent) {
    if(currentLayer != 6){
        var clicked = getCoords(event, 16);
        var key = clicked[0] + "-" + clicked[1];
        
        if (mouseEvent.shiftKey) {
            delete layers[currentLayer][key];
        } else {
            if(currentLayer == 3){
                layers[currentLayer][key] = [selectionObj[0], selectionObj[1]];
            }else if(currentLayer == 5){
                layers[currentLayer][key] = [selectionVol[0], selectionVol[1]];
            }else{
                layers[currentLayer][key] = [selection[0], selection[1]];
            }
        }
        draw();
    }
}

//Bind mouse events for painting (or removing) tiles on click/drag
canvas.addEventListener("mousedown", () => {
   isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
   isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
   isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (event) => {
   if (isMouseDown) {
      addTile(event);
   }
});

//Utility for getting coordinates of mouse click
function getCoords(e, px) { //smth is wrong with this
   const { x, y } = e.target.getBoundingClientRect();
   const mouseX = e.clientX - x;
   const mouseY = e.clientY - y;
   return [Math.floor(mouseX / px), Math.floor(mouseY / px)];
}

//converts data to image:data string and pipes into new browser tab
function exportLevel(name) {
	let output = ''
    for(let y = 0; y < canvas.height / 16; y++){
        output += '<Row>\n'
        for(let x = 0; x < canvas.width / 16; x++){
            let empty = true
            let loop = 0
            layers.forEach((layer) => {
                if(layer[`${x}-${y}`]){
                    if(empty) output += '<Column>\n'
                    empty = false
                    var [tilesheetX, tilesheetY] = layer[`${x}-${y}`]
                    let value = (tilesheetY * 6) + tilesheetX //tile value
                    switch(loop){
                        case 0:
                            output += `<Background sheet="Tiles">${value}</Background>\n`
                            break
                        case 1:
                            output += `<Terrain sheet="Tiles">${value}</Terrain>\n`
                            break
                        case 2:
                            output += `<Decal sheet="Tiles">${value}</Decal>\n`
                            break
                        case 3:
                            output += `<Objects sheet="Objects">${(tilesheetY * 2) + tilesheetX}</Objects>\n`
                            break
                        case 4:
                            output += `<Fringe sheet="Tiles">${value}</Fringe>\n`
                            break
                        case 5:
                            output += `<Volume sheet="Volume">${value}</Volume>\n`
                            break
                    }
				}
                loop++
            })
            if(empty) output += '<Column/>\n' //empty
            else output += '</Column>\n'
        }
        output += '</Row>\n'
    }

    let start = `<root>
<LevelData editorVersion="${editorVer}" uuid="${self.crypto.randomUUID()}"/>
<Level name="${name}">`

	let end = `</Level>\n</root>`

    return `${start}\n${output}${end}` //xml output
}

async function importBin(event){
    clearCanvas()
    const file = event.target.files.item(0)
    const bin = await file.text('utf8');

    let rows = bin.split('<Row>\n') //make rows
    let rowArray = []
    for(let x of rows){
        rowArray.push(x.slice(0,x.indexOf('</Row>') - 4))
    }
    
    let col = []
    let i = 0
    for(let row of rowArray){
        col[i] = row.split('<Column')
        .map(x => ({
            start: x.match('<Level') != null, //anti start stuff
            emp: x.match('/>') != null,
    
            frin: x.match('<Fringe') != null, //tile sets
            back: x.match('<Background') != null,
            ter: x.match('<Terrain') != null, 
            obj: x.match('<Objects') != null,
            decal: x.match('<Decal') != null,
    
            vol: x.match('<Volume') != null, // 8-15 tutorial signs
            text: x 
        }))
        
        i++
    }

    for(var px = 0;px < col[1].length - 1; px++){
        for(var py = 0;py < rows.length - 1; py++){
            let x = col[parseInt(py) + 1][parseInt(px) + 1]
            if(!x.start){
                if(!x.emp){
                    let volVal = x.text.slice(x.text.indexOf('<Volume') + 23,x.text.indexOf('</Volume>'))
                    let backVal = x.text.slice(x.text.indexOf('<Background') + 26,x.text.indexOf('</Background>'))
                    let terVal = x.text.slice(x.text.indexOf('<Terrain') + 23,x.text.indexOf('</Terrain>'))
                    let objVal = x.text.slice(x.text.indexOf('<Objects') + 25,x.text.indexOf('</Objects>'))
                    let frinVal = x.text.slice(x.text.indexOf('<Fringe') + 22,x.text.indexOf('</Fringe>'))
                    let decalVal = x.text.slice(x.text.indexOf('<Decal') + 21,x.text.indexOf('</Decal>'))
                    
                    let tilesheetX
                    let tilesheetY
        
                    if(x.vol){
                        tilesheetX = volVal % 6
                        tilesheetY = (volVal - (volVal % 6)) / 6
                        layers[5][px + "-" + py] = [tilesheetX, tilesheetY]
                    }
        
                    if(x.frin){
                        tilesheetX = frinVal % 6
                        tilesheetY = (frinVal - (frinVal % 6)) / 6
                        layers[4][px + "-" + py] = [tilesheetX, tilesheetY]
                    }
        
                    if(x.obj){
                        tilesheetX = objVal % 2
                        tilesheetY = (objVal - (objVal % 2)) / 2
                        layers[3][px + "-" + py] = [tilesheetX, tilesheetY]
                    }
        
                    if(x.decal){
                        tilesheetX = decalVal % 6
                        tilesheetY = (decalVal - (decalVal % 6)) / 6
                        layers[2][px + "-" + py] = [tilesheetX, tilesheetY]
                    }
        
                    if(x.ter){
                        tilesheetX = terVal % 6
                        tilesheetY = (terVal - (terVal % 6)) / 6
                        layers[1][px + "-" + py] = [tilesheetX, tilesheetY]
                    }
        
                    if(x.back){
                        tilesheetX = backVal % 6
                        tilesheetY = (backVal - (backVal % 6)) / 6
                        layers[0][px + "-" + py] = [tilesheetX, tilesheetY]
                    }
                }
            }
        }
    }
    draw()
}

//Reset state to empty
function clearCanvas() {
   layers = [{}, {}, {}, {}, {}, {}];
   draw();
}

function setLayer(newLayer) {
   //Update the layer
   currentLayer = newLayer;

   //Update the UI to show updated layer
   var oldActiveLayer = document.querySelector(".layer.active");
   if (oldActiveLayer) {
      oldActiveLayer.classList.remove("active");
   }
   document.querySelector(`[tile-layer="${currentLayer}"]`).classList.add("active");
   draw()
}

function draw() {
   var ctx = canvas.getContext("2d");
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   ctx.globalAlpha = 0.1
   ctx.fillStyle = "black";
   let mod = 0
   for(var x = 0;x < canvas.width; x+= 16){
       for(var y = 0;y < canvas.height; y+= 16){
           if(((y/16) + mod) % 2 == 0) ctx.fillRect(x, y, 16, 16)
       } 
       mod++
   }

   var size_of_crop = 16;
   var curLayer = 0
   layers.forEach((layer) => {
      Object.keys(layer).forEach((key) => {
         //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
         var positionX = Number(key.split("-")[0]);
         var positionY = Number(key.split("-")[1]);
         var [tilesheetX, tilesheetY] = layer[key];

         var mul = 1;
         var usedImage = tilesetImage;
         var offset = [0, 0];

		 ctx.globalAlpha = 0.5
         if(curLayer == 3){ //decides which image to use + transparency
            mul = 3
            offset = calcOffset((tilesheetY * 2) + tilesheetX) //object offset
            usedImage = objectImage
            if(curLayer == currentLayer || currentLayer == 6){
				ctx.globalAlpha = 1
            }
         }else if(curLayer == 5){
            usedImage = volumeImage
            if(currentLayer == 5){
				ctx.globalAlpha = 1
            }else{
                ctx.globalAlpha = 0
            }
         }else{
            if(curLayer == currentLayer || currentLayer == 6){
				ctx.globalAlpha = 1
            }
         }

         ctx.drawImage(
            usedImage,
            tilesheetX * (16 * mul),
            tilesheetY * (16 * mul),
            size_of_crop * mul,
            size_of_crop * mul,
            (positionX * 16) + (offset[0] * 16),
            (positionY * 16) + (offset[1] * 16),
            size_of_crop * mul,
            size_of_crop * mul
         );
      });
      curLayer++
   });
}

function calcOffset(value){ //when object is draw to screen calc offset so center points match up
    switch(value){
        case 0: case 1:
            return [-0.5, -2] //enter
        case 2: case 19: case 24:
            return [-1, -2] //exit, lava spurt, north lazer
        case 4: case 7: case 10: case 20: case 21:
            return [0, -1] // med plat, columns
        case 5: case 8: case 11:
            return [0, -1] // large plat, sprite is 5x1, add offset laters
        case 12:
            return [-0.5, -0.5] //small stomp, center sprite in sheet
        case 13:
            return [0, 0] //large stomp
        case 15: case 16:
            return [-1, -1] //saw moving could be dif, otherwise remove
        case 17:
            return [-1.5, -1] //saw
        case 22: case 23:
            return [-1, -1] //turret both
        case 25:
            return [-1, 0] //south lazer
        case 26: 
            return [-1, -1.5] //torch
        case 27:
            return [-1, -0.5] //key door
        default:
            return [-1, -1] // middle of selection
    }
}

function setCanvasSize(width, height){ //in room size
    let w = parseInt(width)
    let h = parseInt(height)
    canvas.width = 640 * (w / 2)
    canvas.height = 480 * (h / 2)

    if(currentSize[0] > w || currentSize[1] > h) clearCanvas()

    currentSize = [w, h]
    draw()
}

//Initialize app when tileset source is done loading
tilesetImage.onload = function(){
   setCanvasSize(2,2)
   setLayer(1)
}
volumeImage.src = "images/volumeSheet.png"
objectImage.src = "images/objectSheet.png";
tilesetImage.src = "images/tilesheet.png";

function download(filename) {
    if(filename == '') filename = 'unnamed'
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportLevel(filename)));
    pom.setAttribute('download', `${filename}.bin`);
  
    pom.style.display = 'none';
    document.body.appendChild(pom);
  
    pom.click();
  
    document.body.removeChild(pom);
}