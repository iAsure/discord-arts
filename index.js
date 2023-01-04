module.exports = {
  profileImage: require('./src/Code/profileImage'),
};

const profileImage = require("./src/Code/profileImage")
const fs = require("fs")

async function genImg(){
const buffer = await profileImage("339919990947971105")
fs.writeFileSync("test.png", buffer)

}

genImg()