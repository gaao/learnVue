const express = require('express')
const compression = require('compression')
const app = express()

// 一定要写在静态代码之前
app.use(compression())
app.use(express.static('./dist'))

app.listen(80, () => {
  console.log('Express server listening on port 80,running at http://127.0.0.1')
})
