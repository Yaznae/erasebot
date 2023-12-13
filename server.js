const express = require("express")

const server = express()

server.all("/", (req, res) => {
  res.send('<meta http-equiv="refresh" content="0; URL=https://phantom.is-a.dev/support"/>')
})

function keepAlive() {
  server.listen(3000, () => {
    console.log("# server is ready.")
  })
}

module.exports = keepAlive