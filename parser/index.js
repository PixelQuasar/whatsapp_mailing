const xlsx = require('xlsx')
const path = require('path')
const fs = require('fs')

const inputPath = path.join(__dirname, 'input/input.xlsx')
const outputPath = path.join(__dirname, 'output/sheet1.json')

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

async function generateExcel () {
    let outputArray = []
    try {
        const file = xlsx.readFile(inputPath)
        console.log("file has read")
        const array = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])
        //console.log(array)
        for (obj of array){
            for (let i = 1; i < Object.keys(obj).length; i++){
                for (number of Object.keys(obj)[i].split("\n")){
                    outputArray.push(number
                        .replaceAll('\r','')
                        .replaceAll('+','')
                        .replaceAll('-','')
                        .replaceAll('(','')
                        .replaceAll(')','')
                        .replaceAll(' ',''))
                }
            }
        }
        await fs.writeFile(outputPath, JSON.stringify(outputArray), () => {})
        console.log("file has written")
        //console.log(outputArray)
    }
    catch (err) {
      if (err) {
        console.log('parser generateExcel Error: ', err)
      }
    }
  }

generateExcel()