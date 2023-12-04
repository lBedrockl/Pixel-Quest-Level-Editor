const fs = require('fs')
const bins = fs.readdirSync('./binaryData')
const Jimp = require('jimp')

//./164_src.Components.LevelLoader_lvl_Easy_01.bin lost gift


//decomp

for(let binName of bins) run(binName) //does all levels in binaryData

//run('135_src.Components.LevelLoader_lvl_Hard_16.bin') //for doing 1 level image

function run(binN){
    let bin = fs.readFileSync(`./binaryData/${binN}`, 'utf8')
    
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
            start: x.match('level') != null, //anti start stuff
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
    
    
    //output image
    let perPixel = 8
    
    new Jimp ((col[1].length - 1) * perPixel, (rows.length - 1) * perPixel, '#000000', (err,image) => {
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (px, py, idx) {
            let red = 0
            let green = 0
            let blue = 0
            let alpha 
    
            let x = col[parseInt(py/perPixel) + 1][parseInt(px/perPixel) + 1]
            if(!x.start){
                if(!x.emp){ //do stuff to image here
                    let volVal = x.text.slice(x.text.indexOf('<Volume') + 23,x.text.indexOf('</Volume>'))
                    let backVal = x.text.slice(x.text.indexOf('<Background') + 26,x.text.indexOf('</Background>'))
                    let terVal = x.text.slice(x.text.indexOf('<Terrain') + 23,x.text.indexOf('</Terrain>'))
                    let objVal = x.text.slice(x.text.indexOf('<Objects') + 25,x.text.indexOf('</Objects>'))
                    let frinVal = x.text.slice(x.text.indexOf('<Fringe') + 22,x.text.indexOf('</Fringe>'))
                    let decalVal = x.text.slice(x.text.indexOf('<Decal') + 21,x.text.indexOf('</Decal>'))
    
                    //if(x.back) red = backVal*2 + 50;
                    //if(x.ter) green = terVal*2 + 50;
                    //if(x.obj) blue = objVal*2 + 50;
                    //if(x.frin) {red += 100; green += 100, blue += 100}
                    //if(x.decal) {red += 50; green += 50, blue += 50} 
                    //if(x.vol) {red += 50 + volVal*50}

                    // if(x.ter){
                    //     if(terVal % 6 == 0) red += 50
                    //     if(terVal % 6 == 1) blue += 50
                    //     if(terVal % 6 == 2) green += 50
                    //     if(terVal % 6 == 3) {red += 50;blue += 50}
                    //     if(terVal % 6 == 4) {red += 50;green += 50;blue += 50}
                    //     if(terVal % 6 == 5) {red += 50;green += 50}
                    // }

                    if(x.obj){
                        green += 100
                        // if(objVal % 6 == 0) red += 50
                        // if(objVal % 6 == 1) blue += 50
                        // if(objVal % 6 == 2) green += 50
                        // if(objVal % 6 == 3) {red += 50;blue += 50}
                        // if(objVal % 6 == 4) {red += 50;green += 50;blue += 50}
                        // if(objVal % 6 == 5) {red += 50;green += 50}
                    }
    
                    if(x.vol){
                        if(volVal == 0) blue += 100
                        // if(volVal == 1) blue += 50
                        // if(volVal == 2) green += 50
                        if(volVal == 3) red += 100
                        // if(volVal == 4) {red += 50;green += 50;blue += 50}
                        // if(volVal == 5) {red += 50;green += 50}
                        // if(volVal == 6) {green += 50;blue += 50}
                        // if(volVal >= 7) {red += 200}
                    }

                    // if(x.vol){
                    //     red = 50 + (px % perPixel) * perPixel * 3
                    //     blue = 50 + (py % perPixel) * perPixel * 3
                    // }

                }
                else alpha = 0
            }
            if(red != 0) this.bitmap.data[idx + 0] = Math.min(255,red)
            if(green != 0) this.bitmap.data[idx + 1] = Math.min(255,green)
            if(blue != 0) this.bitmap.data[idx + 2] = Math.min(255,blue)
            if(alpha) this.bitmap.data[idx + 3] = Math.min(255,alpha)
    
            if (px == image.bitmap.width - 1 && py == image.bitmap.height - 1) {
                image.write(`./images/${binN}.png`)
            }
        })
    })
}