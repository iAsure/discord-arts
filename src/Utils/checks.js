function parseImg(imgString) {
  if(!imgString) return false
  const URL = imgString.split('.')
  const imgType = URL[URL.length - 1]
  const imgCheck = /(jpg|png|gif)/gi.test(imgType)

  if(!imgCheck)
    throw new Error(`Discord Arts | Invalid customBackground (${imgString}) must be an image file 'png | jpg | gif'`);

  return imgString
}

function parsePng(imgString) {
  if(!imgString) return false
  const URL = imgString.split('.')
  const imgType = URL[URL.length - 1]
  const imgCheck = /(png)/gi.test(imgType)

  if(!imgCheck)
    throw new Error(`Discord Arts | Invalid custom badge (${imgString}) must be a png file`);

  return imgString
}

function parseHex(hexString){
  const hexRegex = new RegExp(/[a-fA-F0-9]{6}|#[a-fA-F0-9]{6}|[a-fA-F0-9]{3}|#[a-fA-F0-9]{3}/)

  if(!hexRegex.test(hexString))
    throw new Error(`Discord Arts | Invalid Hex Code (${hexString})`);
  
  if(!hexString.includes('#') && !hexString.startsWith('#'))
    hexString = '#'+hexString

  return hexString  
}

function isString(param, type){
  if(typeof param !== 'string')
    throw new Error(`Discord Arts | Invalid ${type}, must be a string`);

  return param
}

module.exports = { parseImg, parsePng, parseHex, isString }