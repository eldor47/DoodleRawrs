
var legendaryIds = [1, 20, 123, 204, 236, 392, 448, 656, 778, 993, 1105, 1396, 1548, 1721, 2128, 2227, 2478, 2858]
const fs = require('fs');

const metadata = require('./overall_metadata.json');

//Update this to update the base URI
const baseURI = 'ipfs://QmXhzfmjomndotPrzsNURewjx1qchwUTJJYNcZmJjXTHnV/';

for (var file of metadata){
    var id = parseInt(file.image.split('/')[3].split('.')[0])
    console.log(file.image)
    if(legendaryIds.includes(id)){
        var legendaryFile = require('./Images/combined/Json/' + id + '.json');
        legendaryFile.image = baseURI + file.image.split('/')[3]
        var json = JSON.stringify(legendaryFile);
        fs.writeFileSync(`./IPFSFix/json/${id}.json`, json, 'utf8');
    } else {
        file.image = baseURI + file.image.split('/')[3]
        var json = JSON.stringify(file);
        fs.writeFileSync(`./IPFSFix/json/${id}.json`, json, 'utf8');
    }
}
