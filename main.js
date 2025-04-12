const body = document.querySelector("body");
var canvas = document.querySelector("#canvas");
var canvasSelection = document.querySelector(".canvas-container_selection");

//volumes
var volumeContainer = document.querySelector(".volume-container");
var volumeSelection = document.querySelector(".volume-container_selection");
var volumeSelection2 = document.querySelector(".volume-container_selection2");
var volumeImage = document.querySelector("#volume-source");


//tiles
var tilesetContainer = document.querySelector(".tileset-container");
var tilesetSelection = document.querySelector(".tileset-container_selection");
var tilesetSelection2 = document.querySelector(".tileset-container_selection2");
var tilesetImage = document.querySelector("#tileset-source");

//3x3
var objectContainer = document.querySelector(".object-container");
var objectSelection = document.querySelector(".object-container_selection");
var objectSelection2 = document.querySelector(".object-container_selection2");
var objectImage = document.querySelector("#object-source");


var editorVer = '1.5.0';
document.getElementById("editorVersion").innerHTML = "v" + editorVer;
document.getElementById("title").innerHTML = "Pixel Quest Map Editor v" + editorVer;

var currentSize = [2, 2];

var selection = [0, 0];
var selectionObj = [0, 0];
var selectionVol = [0, 0];

var selectionTile = [0, 0];
var selectionColor = 'cyan';
var currentTileset = 0;
var useIngameBG = false;

var showVolumes = false;
var placingBox = false;

var isMouseDown = false;
var isMouseOn = false;
var currentLayer = 0;
var currentCoords = [0,0]; //mouse coords for copy paste because keyboard events no update the mouse coords
var clipboard = {'storing': false};
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

document.addEventListener("keypress", (event) => {updateHover(event)});

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});

//MARK: Listeners
tilesetImage.addEventListener("mousedown", (event) => {
   if(currentLayer == 3 || currentLayer == 5) setLayer(1)
   selection = getCoords(event, 16);
   tilesetSelection.style.left = selection[0] * 16 + "px";
   tilesetSelection.style.top = selection[1] * 16 + "px";
});

tilesetImage.addEventListener("mouseleave", () => {
    tilesetSelection2.style.outline = '0px solid black'
});

tilesetImage.addEventListener("mousemove", (event) => {
    selectionTile = getCoords(event, 16);
    tilesetSelection2.style.left = selectionTile[0] * 16 + "px";
    tilesetSelection2.style.top = selectionTile[1] * 16 + "px";
    tilesetSelection2.style.outline = '3px solid white'
});

//select volume
volumeImage.addEventListener("mousedown", (event) => {
    if(currentLayer != 5) setLayer(5)
    selectionVol = getCoords(event, 16);
    volumeSelection.style.left = selectionVol[0] * 16 + "px";
    volumeSelection.style.top = selectionVol[1] * 16 + "px";
});

volumeImage.addEventListener("mouseleave", () => {
    volumeSelection2.style.outline = '0px solid black'
});

volumeImage.addEventListener("mousemove", (event) => {
    selectionTile = getCoords(event, 16);
    volumeSelection2.style.left = selectionTile[0] * 16 + "px";
    volumeSelection2.style.top = selectionTile[1] * 16 + "px";
    volumeSelection2.style.outline = '3px solid white'
});

//Select object from the objects grid
objectImage.addEventListener("mousedown", (event) => {
    if(currentLayer != 3) setLayer(3)
    selectionObj = getCoords(event, 48);
    objectSelection.style.left = selectionObj[0] * 48 + "px";
    objectSelection.style.top = selectionObj[1] * 48 + "px";
});

objectImage.addEventListener("mouseleave", () => {
    objectSelection2.style.outline = '0px solid black'
});

objectImage.addEventListener("mousemove", (event) => {
    selectionTile = getCoords(event, 48);
    objectSelection2.style.left = selectionTile[0] * 48 + "px";
    objectSelection2.style.top = selectionTile[1] * 48 + "px";
    objectSelection2.style.outline = '3px solid white'
});

var boxPlace = false
var boxStart
//Handler for placing new tiles on the map
function addTile(mouseEvent) {
    if(currentLayer != 6){
        var mousePos = getCoords(mouseEvent, 16);
        var key = mousePos[0] + "-" + mousePos[1];

        if(mouseEvent.button == 1 || mouseEvent.button >= 3){
            //1 middle mouse, 3 back page, 4 forward pagecvxcvxcvx
        }else if(mouseEvent.button == 2){
            if(!boxPlace) boxStart = mousePos
            boxPlace = !boxPlace
            
        }else if(currentLayer != 3 && mouseEvent.ctrlKey){ //MARK: copy paste
            if(mouseEvent.key == 'c' && boxPlace || mouseEvent.key == 'x' && boxPlace){
                boxPlace = false
                clipboard['storing'] = true
                clipboard['size'] = [Math.abs(boxStart[0] - mousePos[0]), Math.abs(boxStart[1] - mousePos[1])]
                if(boxStart[0] < mousePos[0]){
                    for(let i = boxStart[0]; i <= mousePos[0];i++){
                        if(boxStart[1] < mousePos[1]){
                            for(let o = boxStart[1]; o <= mousePos[1];o++){
                                copyPaste((i - boxStart[0]) + "-" + (o - boxStart[1]), i + "-" + o, mouseEvent.key)
                            }
                        }else{
                            for(let o = boxStart[1]; o >= mousePos[1];o--){
                                copyPaste((i - boxStart[0]) + "-" + (o - mousePos[1]), i + "-" + o, mouseEvent.key)
                            }
                        }
                    }
                }else{
                    for(let i = boxStart[0]; i >= mousePos[0];i--){
                        if(boxStart[1] < mousePos[1]){
                            for(let o = boxStart[1]; o <= mousePos[1];o++){
                                copyPaste((i - mousePos[0]) + "-" + (o - boxStart[1]), i + "-" + o, mouseEvent.key)
                            }
                        }else{
                            for(let o = boxStart[1]; o >= mousePos[1];o--){
                                copyPaste((i - mousePos[0]) + "-" + (o - mousePos[1]), i + "-" + o, mouseEvent.key)
                            }
                        }
                    }
                }
            }else if(mouseEvent.key == 'v' && !boxPlace){
                boxPlace = false
                for(let i = mousePos[0]; i <= mousePos[0] + clipboard['size'][0];i++){
                    for(let o = mousePos[1]; o <= mousePos[1] + clipboard['size'][1];o++){
                        copyPaste((i - mousePos[0]) + "-" + (o - mousePos[1]) ,i + "-" + o, mouseEvent.key)
                    }
                }
            }
        }else if(mouseEvent.button == 0 && boxPlace && currentLayer != 3){
            //loop over everytile within bounds
            if(boxStart[0] < mousePos[0]){
                for(let i = boxStart[0]; i <= mousePos[0];i++){
                    if(boxStart[1] < mousePos[1]){
                        for(let o = boxStart[1]; o <= mousePos[1];o++){
                            loopPlace(i + "-" + o, mouseEvent.shiftKey)
                        }
                    }else{
                        for(let o = boxStart[1]; o >= mousePos[1];o--){
                            loopPlace(i + "-" + o, mouseEvent.shiftKey)
                        }
                    }
                }
            }else{
                for(let i = boxStart[0]; i >= mousePos[0];i--){
                    if(boxStart[1] < mousePos[1]){
                        for(let o = boxStart[1]; o <= mousePos[1];o++){
                            loopPlace(i + "-" + o, mouseEvent.shiftKey)
                        }
                    }else{
                        for(let o = boxStart[1]; o >= mousePos[1];o--){
                            loopPlace(i + "-" + o, mouseEvent.shiftKey)
                        }
                    }
                }
            }
            boxPlace = !boxPlace // remove this to make placing not cancel
        }else if(mouseEvent.shiftKey){
            delete layers[currentLayer][key];
        }else{
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

function loopPlace(newKey, remove){
    if(remove){
        delete layers[currentLayer][newKey];
    }else{
        if(currentLayer == 5){
            layers[currentLayer][newKey] = [selectionVol[0], selectionVol[1]];
        }else{
            layers[currentLayer][newKey] = [selection[0], selection[1]];
        }
    }
    
}

function copyPaste(clipKey, layerKey, keyPressed){
    if(currentLayer != 5){
        switch (keyPressed){
            case "c":
                clipboard[clipKey] = layers[currentLayer][layerKey]
            break
            case "x":
                clipboard[clipKey] = layers[currentLayer][layerKey]
                delete layers[currentLayer][layerKey];
            break
            case "v":
                if(clipboard[clipKey] != undefined) {
                    layers[currentLayer][layerKey] = clipboard[clipKey]
                }
            break
        }
    }
}

var buttonDown = 0;
//Bind mouse events for painting (or removing) tiles on click/drag
canvas.addEventListener("mousedown", (event) => {
    isMouseDown = true
    buttonDown = event.button
    updateHover(event)
    addTile(event)
});

canvas.addEventListener("mouseup", (event) => {
    isMouseDown = false
    updateHover(event)
});

canvas.addEventListener("mouseleave", () => {
    isMouseDown = false
    isMouseOn = false
    if(!boxPlace) canvasSelection.style.outline = 'black'
});

canvas.addEventListener("mousemove", (event) => {
    isMouseOn = true
    if(isMouseDown && !boxPlace && buttonDown == 0) addTile(event)
    updateHover(event)
});

onkeydown = updateHover
onkeyup = updateHover

function updateHover(e){
    if(isMouseOn){
        var coords = getCoords(e, 16)
        if(clipboard['storing'] && e.ctrlKey && !boxPlace){
            canvasSelection.style.outline = '3px solid yellow'
            canvasSelection.style.width = (clipboard['size'][0] + 1) * 16 + 'px'
            canvasSelection.style.height = (clipboard['size'][1] + 1) * 16 + 'px'
            canvasSelection.style.left = canvas.offsetLeft + coords[0] * 16 + 'px'
            canvasSelection.style.top = canvas.offsetTop + coords[1] * 16 + 'px'
        }else if(boxPlace){
            canvasSelection.style.outline = '3px solid lime'
            canvasSelection.style.width = (Math.abs(boxStart[0] - coords[0]) + 1) * 16 + 'px'
            canvasSelection.style.height = (Math.abs(boxStart[1] - coords[1]) + 1) * 16 + 'px'
            canvasSelection.style.left = canvas.offsetLeft + Math.min(boxStart[0], coords[0]) * 16 + 'px'
            canvasSelection.style.top = canvas.offsetTop + Math.min(boxStart[1], coords[1]) * 16 + 'px'
        }else if(currentLayer == 3){
            var offset = calcOffset(((selectionObj[1] * 2) + selectionObj[0]))
            var size = calcSize(((selectionObj[1] * 2) + selectionObj[0]))
            //console.log('size ' + size + "   object " + ((selectionObj[1] * 2) + selectionObj[0]))
            if(size[2] == 'ignore') offset = [0,0]
            if(size[2] == 'shift right') offset = [offset[0]+1, offset[1]]
            if(size[2] == 'turret') offset = [-1, 0]
            if(size[2] == 'torch') offset = [0, -1]

            canvasSelection.style.outline = `3px solid ${selectionColor}`
            canvasSelection.style.width = size[0] * 16 + 'px'
            canvasSelection.style.height = size[1] * 16 + 'px'
            canvasSelection.style.left = canvas.offsetLeft + (coords[0] + offset[0]) * 16 + 'px'
            canvasSelection.style.top = canvas.offsetTop + (coords[1] + offset[1]) * 16 + 'px'
        }else{
            canvasSelection.style.outline = `3px solid ${selectionColor}`
            canvasSelection.style.width = '16px'
            canvasSelection.style.height = '16px'
            canvasSelection.style.left = canvas.offsetLeft + coords[0] * 16 + 'px'
            canvasSelection.style.top = canvas.offsetTop + coords[1] * 16 + 'px'
        }
        if(e.shiftKey && !e.ctrlKey) canvasSelection.style.outline = '3px solid red'
        if(e.ctrlKey && e.key == 'c' && boxPlace || e.ctrlKey && e.key == 'x' && boxPlace || e.ctrlKey && e.key == 'v' && !boxPlace) {
            canvasSelection.style.outline = '3px solid yellow'
            addTile(e)
        }
    }
}

//Utility for getting coordinates of mouse click
function getCoords(e, px) {
    if(e.key != null) return currentCoords //jank
    const { x , y , width , height } = e.target.getBoundingClientRect()
    const mouseX = Math.abs(e.clientX - x)
    const mouseY = Math.abs(e.clientY - y)
    currentCoords = [
        Math.min(Math.floor(mouseX / px), width),
        Math.min(Math.floor(mouseY / px), height)
    ]
    return currentCoords
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
<LevelData editorVersion="${editorVer}" uuid="${self.crypto.randomUUID()}" tileset="${tilesetNames[currentTileset].folder}" author="${document.getElementById("authName").value}"/>
<Level name="${name}">`

	let end = `</Level>\n</root>`

    return `${start}\n${output}${end}` //xml output
}

async function importBin(event){
    clearCanvas()
    const file = event.target.files.item(0)
    const bin = await file.text('utf8')

    let newbin = bin.replace(/(\r\n|\n|\r)/gm, '\n')
    let rows = newbin.split('<Row>\n')

    let rowArray = []
    for(let x of rows){
        rowArray.push(x.slice(0,x.indexOf('</Row>')))
    }
    let col = []
    let i = 0
    for(let row of rowArray){
        col[i] = row.split('<Column')
        .map(x => ({
            start: x.match('<Level') != null, //anti start stuff
            emp: x.match('/>') != null,
    
            frin: x.match('<Fringe') != null,
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

    bininfo = col[0][0].text.split('=')
    document.getElementById("lvlName").value = extractFirstText(bininfo[bininfo.length-1])

    // bininfo[1] = editorVersion
    // bininfo[2] = uuid

    if(col[0][0].text.includes('tileset=')){
        for(let i = 0; i < tilesetNames.length; i++){
            if(tilesetNames[i].folder == extractFirstText(bininfo[3])){
                switchTileset(i)
            }
        }
    }else{
        switchTileset(0)
    }

    if(col[0][0].text.includes('author=')){
        document.getElementById("authName").value = extractFirstText(bininfo[4])
    }else{
        document.getElementById("authName").value = ""
    }

    setLayer(6)
    setCanvasSize(col[1].length - 1, rows.length - 1, false)
    draw()

}

function extractFirstText(str){
    var matches = str.match(/"(.*?)"/)
    return matches[1]
}

//Reset state to empty
function clearCanvas() {
   layers = [{}, {}, {}, {}, {}, {}];
   draw();
   document.getElementById("lvlName").value = ""
   document.getElementById("authName").value = ""
   switchTileset(0)
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
   var ctx = canvas.getContext("2d")
   ctx.clearRect(0, 0, canvas.width, canvas.height)

   var size_of_crop = 16
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
            if(currentLayer == 5 || currentLayer == 6 && showVolumes){
				ctx.globalAlpha = 1
            }else if(!showVolumes){
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

function calcSize(value){ //outline size
    switch(value){
        case 3: case 6: case 9: case 14: case 18: case 28: case 29: case 30: case 31: case 32:
            return [1, 1, 'ignore']
        case 12:
            return [2, 2, 'ignore']
        case 0: case 1: case 2: case 13: case 15: case 16: case 17:
            return [3, 3]
        case 19: case 24: case 25:
            return [1, 3, 'shift right']
        case 20: case 21: case 4: case 5: case 7: case 8: case 10: case 11:
            return [3, 1, 'ignore']
        case 22: case 23:
            return [3, 1, 'turret']
        case 26:
            return [1, 2, 'torch']
        case 27:
            return [1, 2, 'ignore']
    }
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

function setCanvasSize(width, height, clear){ //in room size
    let w = parseInt(width)
    let h = parseInt(height)
    canvas.width = 16 * w
    canvas.height = 16 * h
    document.getElementById('canvasBG').style.width = 16 * w + 'px'
    document.getElementById('canvasBG').style.height = 16 * h + 'px'

    if(currentSize[0] > w || currentSize[1] > h) if(clear) clearCanvas()

    currentSize = [w, h]
    draw()
    document.getElementById('roomX').value = w;
    document.getElementById('roomY').value = h;

    document.getElementById("html").style.width = `${Math.max(w*0.95,100)}%` // this is dumb but it works lol
}

//Initialize app when tileset source is done loading
var loaded = false
tilesetImage.onload = function(){
    if(!loaded){
        createHtmlElements()
        setCanvasSize(40,30,true)
        setLayer(1)
        changeColors()
        loaded = true
    }else{
        draw()
    }
}
volumeImage.src = `tilesets/${tilesetNames[0].folder}/volume.png`
objectImage.src = `tilesets/${tilesetNames[0].folder}/object.png`
tilesetImage.src = `tilesets/${tilesetNames[0].folder}/tile.png`

function download(filename) {
    if(filename == '') filename = 'unnamed'
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportLevel(filename)));
    if(document.getElementById("authName").value != ''){
        pom.setAttribute('download', `${filename} by ${document.getElementById("authName").value}.bin`);
    }else{
        pom.setAttribute('download', `${filename}.bin`);
    }
    
    pom.style.display = 'none';
    document.body.appendChild(pom);
  
    pom.click();
  
    document.body.removeChild(pom);
}

function volSwitch(checked){
    showVolumes = checked
    draw()
}

function changeBG(checked){
    useIngameBG = checked
    let canvasBG = document.getElementById('canvasBG')
    if(useIngameBG){
        canvasBG.style.backgroundImage = `url('tilesets/${tilesetNames[currentTileset].folder}/background.png')`
        if(!(tilesetNames[currentTileset].bgColor == undefined)){
            canvasBG.style.backgroundColor = tilesetNames[currentTileset].bgColor
        }else{
            canvasBG.style.backgroundColor = 'transparent'
        }
        canvasBG.style.backgroundRepeat = 'repeat-x'
    }else{
        canvasBG.style.backgroundImage = `url('tilesets/default/defaultBG.png')`
        canvasBG.style.backgroundColor = 'transparent'
        canvasBG.style.backgroundRepeat = 'repeat'
    }
}

function switchTileset(picked){
    currentTileset = picked
    if(!tilesetNames[picked].tile){
        tilesetImage.src = `tilesets/${tilesetNames[0].folder}/tile.png`
    }else{tilesetImage.src = `tilesets/${tilesetNames[picked].folder}/tile.png`}
    
    if(!tilesetNames[picked].object){
        objectImage.src = `tilesets/${tilesetNames[0].folder}/object.png`
    }else{objectImage.src = `tilesets/${tilesetNames[picked].folder}/object.png`}

    if(!tilesetNames[picked].volume){
        volumeImage.src = `tilesets/${tilesetNames[0].folder}/volume.png`
    }else{volumeImage.src = `tilesets/${tilesetNames[picked].folder}/volume.png`}

    if(!(tilesetNames[picked].color == undefined)){ // idk why but it needs () or it breaks lol
        selectionColor = tilesetNames[picked].color
    }else{selectionColor = tilesetNames[0].color}

    tilesetSelection.style.outline = `3px solid ${selectionColor}`
    objectSelection.style.outline = `3px solid ${selectionColor}`
    volumeSelection.style.outline = `3px solid ${selectionColor}`

    changeColors()
    changeBG(useIngameBG)
}

function createHtmlElements(){
    for(let i = 0; i < tilesetNames.length; i++){
        let button = document.createElement('button')
        button.textContent = tilesetNames[i].name
        button.onclick = function () { switchTileset(i) }
        document.getElementsByClassName('dropdown-content')[0].appendChild(button)
    }
}

function changeColors(){ //if I add new css do it at bottom, it will break this currently
    var mainColor = colorToRGBA(selectionColor)
    var midColor = [Math.floor(mainColor[0]/1.25),Math.floor(mainColor[1]/1.25),Math.floor(mainColor[2]/1.25),mainColor[3]]
    var darkerColor = [Math.floor(mainColor[0]/2),Math.floor(mainColor[1]/2),Math.floor(mainColor[2]/2),mainColor[3]]

    document.querySelector('body').style.color = rgbaToText(mainColor)
    document.querySelector('#canvas').style.outlineColor = rgbaToText(mainColor)
    document.querySelector('.image1').style.backgroundColor = rgbaToText(midColor)
    document.querySelector('.tooltip-text').style.backgroundColor = rgbaToText(darkerColor)
    document.querySelector('.hover-text').style.background = rgbaToText(darkerColor)

    let title = document.querySelector('.card').querySelector('header').querySelector('h1')
    title.style.color = rgbaToText(mainColor)
    title.onmouseover = function() {this.style.color = rgbaToText(darkerColor)}
    title.onmouseleave = function() {this.style.color = rgbaToText(mainColor)}
    
    for (const [key, value] of Object.entries(document.styleSheets[2].cssRules)) { // probs a better way to change styles idk
        //console.log(`${key}: ${value.selectorText}`); // finds rule number for css stuff
        if(value.selectorText == 'input[type=\"checkbox\"]:checked::after'){
            document.querySelectorAll('input').forEach((elem) => {
                if(elem.type == 'checkbox'){
                    elem.addEventListener('change', function() {
                        document.styleSheets[2].cssRules[key].style.borderColor = rgbaToText(mainColor)
                    }) 
                    document.styleSheets[2].cssRules[key].style.borderColor = rgbaToText(mainColor)
                }
            })
        }
    }

    document.querySelectorAll('.layers').forEach((elem) => {
        elem.querySelectorAll('li').forEach((elem2) => {
            var elem3 = elem2.querySelector('button')

            if(elem3.className == 'layer active'){ //updates on tileset change
                elem3.style.color = rgbaToText(mainColor)
                elem3.style.background = `linear-gradient(90deg, ${rgbaToText(darkerColor)}-100%, rgb(0, 0, 0) 100%)`
            }else{
                elem3.style.color = 'white'
                elem3.style.background = ''
            }

            elem3.onmouseover = function() {this.style.color = rgbaToText(mainColor)}
            elem3.onmouseleave = function() {this.style.color = this.className == 'layer active' ? rgbaToText(mainColor) : 'white'}
            
            objectImage.addEventListener('click', function() {updateLayerColor()})
            volumeImage.addEventListener('click', function() {updateLayerColor()})
            tilesetImage.addEventListener('click', function() {updateLayerColor()})

            elem3.addEventListener('click', function() {updateLayerColor()})

            function updateLayerColor(){
                document.querySelectorAll('.layers').forEach((elem) => { 
                    elem.querySelectorAll('li').forEach((elem2) => {
                        var elem3 = elem2.querySelector('button')
                        if(elem3.className == 'layer'){
                            elem3.style.color = 'white'
                            elem3.style.background = ''
                        }else{
                            elem3.style.color = rgbaToText(mainColor)
                            elem3.style.background = `linear-gradient(90deg, ${rgbaToText(darkerColor)}-100%, rgb(0, 0, 0) 100%)`
                        }
                    })
                })
            }
        })
    })
    
    document.querySelector('.dropdown-content').querySelectorAll('button').forEach((elem) => {
        elem.style.color = rgbaToText(mainColor)
        elem.onmouseover = function() {this.style.backgroundColor = rgbaToText(darkerColor)}
        elem.onmouseleave = function() {this.style.backgroundColor = 'rgba(0,0,0,0)'}
        elem.onmousedown = function() {this.style.backgroundColor = 'rgba(0,0,0,0)'}
    })
    
    document.querySelectorAll('.primary-button').forEach((elem) => {
        elem.style.backgroundColor = rgbaToText(midColor)
        elem.style.borderBottomColor = rgbaToText(darkerColor)

        elem.onmouseover = function() {this.style.backgroundColor = rgbaToText(darkerColor)}
        elem.onmouseleave = function() {this.style.backgroundColor = rgbaToText(midColor)}
    })

}

function colorToRGBA(color) { //yoink
    var cvs, ctx;
    cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}

function rgbaToText(rgba){
    return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`
}