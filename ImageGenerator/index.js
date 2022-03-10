console.log('The start');

const fs = require('fs');

//const { createQR } = require('./generateQR.js')

const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(1080, 1080);
const ctx = canvas.getContext("2d");

const slimeCanvas = createCanvas(1080, 1080);
const ctxS = slimeCanvas.getContext("2d");

const baseURI = 'https://mkb-public-files.s3.us-west-1.amazonaws.com/';

let overallMetadata = []

const saveLayer = async (_canvas, imgName) => {
    try{
        fs.writeFileSync(`./Images/combined/Images/${imgName}`, _canvas.toBuffer("image/png"));
    } catch (e){
        console.log(e)
        console.log("File already exists")
    }
}

const drawLayers = async (layerImages, imgName, filePaths, id) => {
    var layers = []
    console.log(filePaths)
    for(var path of filePaths){
        var dirSplit = path.split('/')
        var key = dirSplit[2].split('_')[1]
        var nonBodyTrait = dirSplit[3].split("_")[2] ? dirSplit[3].split("_")[2]
            .substring(0, dirSplit[3].split("_")[2].length-4) : 'None'
        if(nonBodyTrait.includes('-')){
            nonBodyTrait = nonBodyTrait.substring(0, nonBodyTrait.length-2)
        }
        if(key == 'Body'){
            if(dirSplit[3].includes('Top')) {
                var headVal = dirSplit[4].split("_")[2] ? (dirSplit[4].split("_")[2]
                        .substring(0, dirSplit[4].split("_")[2].length - 4)) : 'None'
                if(headVal.includes('-'))
                    headVal = headVal.substring(0, headVal.length-2)
                layers.push({
                    trait_type: "Head",
                    value: headVal
                })
            } else {
                if(dirSplit[3].includes('Body')){
                    layers.push({
                        trait_type: "Body Color",
                        value: dirSplit[3].split("_")[2]
                    })

                    layers.push({
                        trait_type: "Creature",
                        value: dirSplit[3].split("_")[1]
                    })
                } else {
                    var backVal = dirSplit[4].split("_")[2] ? (dirSplit[4].split("_")[2]
                        .substring(0, dirSplit[4].split("_")[2].length - 4)) : 'None'
                    layers.push({
                        trait_type: "Back",
                        value: backVal
                    })
                }
            }
        } else if(key == 'Backgrounds'){
            layers.push({
                trait_type: "Background",
                value: nonBodyTrait
            })
        } else if(key == 'Mouth'){
            layers.push({
                trait_type: "Mouth",
                value: nonBodyTrait
            })
        } else if(key == 'Blush'){
            layers.push({
                trait_type: "Blush",
                value:nonBodyTrait
            })
        } else if(key == 'Eyes'){
            if(nonBodyTrait.includes('Postit')){
                filePaths[4] = './None.png'
                filePaths[5] = './None.png'
                layerImages[4] = await loadImage('./None.png')
                layerImages[5] = await loadImage('./None.png')
                layers[5] = {
                    trait_type: "Mouth",
                    value: nonBodyTrait
                }
                layers[6] = {
                    trait_type: "Blush",
                    value: "None"
                }
            }
            layers.push({
                trait_type: "Eyes",
                value: nonBodyTrait
            })
        }
    }

    // Duplicate check here
    var metaData = await generateAttribute(layers, id)

    for(var layer of layerImages){
        ctxS.drawImage(layer, 0, 0, 1080, 1080)
    }

    saveLayer(slimeCanvas, imgName)
    ctxS.clearRect(0, 0, slimeCanvas.width, slimeCanvas.height)

    return metaData
}

var layers = []
var bodySpikes = {}

async function generateSlimes(totalNum) {
    var fromPath = './Images/'
    try {
        // Get the files as an array
        const files = await fs.promises.readdir( fromPath );

        // Loop them all with the new for...of
        var i = 0;
        for( const file of files ) {
            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat( fromPath );

            if( stat.isDirectory() ){
                if((fromPath + file) !== './Images/combined') {
                    var layer = await generateLayerArray(i, fromPath + file, file)
                    if(layer.length > 0){
                        layers.push(layer)
                    }
                }
            }
            //console.log(layers)

            i++

        } // End for...of
    }
    catch( e ) {
        // Catch anything bad that happens
        console.error( "We've thrown! Whoops!", e );
    }

    var uniqStrings = []
    for(var i = 1; i <= totalNum; i++){
        var layerImages = []
        var filePaths = []
        for(var layer of layers){
            var num = weightedRand(layer)
            var resultNum = num()
            var topLayer
            var uniqString

            if(layer[resultNum].filePath.includes('Body')){
                layer[resultNum].filePath.includes('Body')
                var bodyType = layer[resultNum].value.split('_')[1]


                // Spikes
                for(var key in bodySpikes){
                    if(key === bodyType && !key.includes('Top')){
                        var num2 = weightedRand(bodySpikes[key])
                        var resultNum2 = num2()
                        var layerImage2 = await loadImage(bodySpikes[key][resultNum2].filePath);
                        layerImages.push(layerImage2)
                        filePaths.push(bodySpikes[key][resultNum2].filePath)
                    }
                }

                // Top Layer
                for(var key in bodySpikes){
                    if(key.includes(bodyType) && key.includes('Top')){
                        var num2 = weightedRand(bodySpikes[key])
                        var resultNum2 = num2()
                        var layerImage2 = await loadImage(bodySpikes[key][resultNum2].filePath);
                        topLayer = layerImage2
                        filePaths.push(bodySpikes[key][resultNum2].filePath)
                        //layerImages.push(layerImage2)
                    }
                }
            }

            var layerImage = await loadImage(layer[resultNum].filePath);
            filePaths.push(layer[resultNum].filePath)
            layerImages.push(layerImage)
            if(topLayer){
                layerImages.push(topLayer)
                topLayer = undefined
            }
         }

         var metaData = await drawLayers(layerImages, (i + '.png'), filePaths, i )
         uniqString = metaData.attributes.map((m) => m.value ).join('-')
         console.log("DoodleRawr #" + i)
         console.log(uniqString)
         if(uniqStrings.includes(uniqString)){
             console.log('DUPEEE')
             i--
         } else {
            uniqStrings.push(uniqString)
            overallMetadata.push(metaData)
         }
    }

    // Save data here
    var json = JSON.stringify(overallMetadata);
    fs.writeFileSync(`./overall_metadata.json`, json, 'utf8');
}

async function generateLayerArray(layerId, filePath, layerName){
    const files = await fs.promises.readdir( filePath )

    var layers2 = []
    for( const file of files ) {
        const stat = await fs.promises.stat( filePath + '/' + file );

        if(stat.isDirectory() && !filePath.includes('combined')){
            var bodyLayers = []
            const bodyFiles = await fs.promises.readdir( filePath + '/' + file )
            for(var bodyFile of bodyFiles) {
                var weight;

                var fileNameNoPNG = file.substring(0, file.length - 4)
                if(fileNameNoPNG.endsWith('C')){
                    weight = 0.3
                } else if(fileNameNoPNG.endsWith('B')){
                    weight = 0.25
                } else if(fileNameNoPNG.endsWith('A')){
                    weight = 0.04
                } else if(fileNameNoPNG.endsWith('S')){
                    weight = 0.01
                } else {
                    // D rank ( its the Default )
                    weight = 0.4
                }
    
                var bodyLayer = {
                    trait_type: layerName,
                    value: bodyFile,
                    weight: weight,
                    filePath: filePath + '/' + file + '/' + bodyFile
                }

                bodyType = file.split('_')[1]
                
                bodyLayers.push(bodyLayer)
            }

            bodySpikes[bodyType] = bodyLayers
        }


        //To Achieve rarity simply store rarity weight in filename
        if( file.endsWith('.png') && !file.includes('combined') ){
            
            var fileNameNoPNG = file.substring(0, file.length - 4)
            if(fileNameNoPNG.endsWith('C')){
                weight = 0.3
            } else if(fileNameNoPNG.endsWith('B')){
                weight = 0.25
            } else if(fileNameNoPNG.endsWith('A')){
                weight = 0.04
            } else if(fileNameNoPNG.endsWith('S')){
                weight = 0.01
            } else {
                // D rank ( its the Default )
                weight = 0.4
            }

            var layer = {
                trait_type: layerName,
                value: file,
                weight: weight,
                filePath: filePath + '/' + file
            }
            layers2.push(layer)
        }
    }
    return layers2
}

const generateAttribute = async(attributes, id ) => {
    var metaData = {
        description: "DoodleRawrs are a fan made collection of doodle like dragons, monsters and dinosaurs.",
        image: `${baseURI}${id}.png`,
        name: 'DoodleRawr #' + id,
        attributes
    }

    var json = JSON.stringify(metaData);
    fs.writeFileSync(`./Images/combined/Json/${id}.json`, json, 'utf8');

    return metaData;
}

function weightedRand(spec) {
    var i, j, table=[];
    for (i in spec) {
        // The constant 10 below should be computed based on the
        // weights in the spec for a correct and optimal table size.
        // E.g. the spec {0:0.999, 1:0.001} will break this impl.
        //console.log(spec)
        var weight = spec[i].weight

        for (j=0; j<weight*10; j++) {
            table.push(i);
        }
    }
    return function() {
      return table[Math.floor(Math.random() * table.length)];
    }
  }

// Change the total amount to generate ( this doesnt take into account dupes yet )
generateSlimes(3000)