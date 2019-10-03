const app = require('../app')
const http = require("http");
const https = require("https");
const fs = require("fs");

const httpsOption = {
    key : fs.readFileSync("./https/meeting_zhangzhenkai.key"),
    cert: fs.readFileSync("./https/meeting_zhangzhenkai.pem")
}

http.createServer(app).listen(3030);
https.createServer(httpsOption, app).listen(3031);