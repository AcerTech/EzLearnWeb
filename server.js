const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors')
app.use(cors())
const PORT = process.env.PORT || 3000;
require("./startup/prod")(app)

// const forceSSL = function () {
//     return function (req, res, next) {
//         if (req.headers['x-forwarded-proto'] !== 'https') {
//             return res.redirect(
//                 ['https://', req.get('Host'), req.url].join('')
//             )
//         }
//         next();
//     }
// }

// Serve static files....
app.use(express.static(__dirname + '/dist/EzLearnWeb'));

// Send all requests to index.html
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/EzLearnWeb/index.html'));
});

// default Heroku PORT
app.listen(PORT, () => {
    console.log('Running on port ' + PORT);
});
