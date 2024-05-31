function parseImg(imgString) {
  if(!imgString || typeof imgString !== 'string') {
    throw new Error(`Discord Arts | Invalid custom badge ('${imgString || undefined}') must be an image file 'png | jpg | jpeg | gif'`);
  }
  const URL = imgString.split('.')
  const imgType = URL[URL.length - 1]
  const imgCheck = /(jpg|jpeg|png|gif)/gi.test(imgType)

  if(!imgCheck)
    throw new Error(`Discord Arts | Invalid customBackground ('${imgString || undefined}') must be an image file 'png | jpg | jpeg | gif'`);

  return imgString
}

function parsePng(imgString) {
  if(!imgString || typeof imgString !== 'string') {
    throw new Error(`Discord Arts | Invalid custom badge ('${imgString || undefined}') must be a png file`);
  }
  const URL = imgString.split('.')
  const imgType = URL[URL.length - 1]
  const imgCheck = /(png)/gi.test(imgType)

  if(!imgCheck)
    throw new Error(`Discord Arts | Invalid custom badge ('${imgString || undefined}') must be a png file`);

  return imgString
}

function parseHex(hexString){
  const hexRegex = new RegExp(/^(#)?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/)

  if(!hexRegex.test(hexString))
    throw new Error(`Discord Arts | Invalid Hex Code ('${hexString || undefined}')`);
  
  if(!hexString.includes('#') && !hexString.startsWith('#'))
    hexString = '#'+hexString

  return hexString  
}

function isString(param, type){
  if(typeof param !== 'string')
    throw new Error(`Discord Arts | Invalid ${type} (${param || undefined}), must be a string`);

  return param
}

function isNumber(param, type){
  if(isNaN(param))
    throw new Error(`Discord Arts | Invalid ${type} (${param || undefined}), must be a number`);

  return param
}

module.exports = { parseImg, parsePng, parseHex, isString, isNumber }