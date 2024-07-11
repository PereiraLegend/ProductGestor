const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Função para garantir que a pasta exista, se não, criar a pasta
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //console.log("req.baseUrl:", req.baseUrl);
        //console.log("req.originalUrl:", req.originalUrl);

        let folderPath;
        if (req.originalUrl.includes('sistema')) {
            folderPath = path.join(__dirname, '../../storage/documents');
        } else if (req.originalUrl.includes('boleto')) {
            folderPath = path.join(__dirname, '../../storage/boletos');
        } else {
            folderPath = path.join(__dirname, '../../storage/others');
        }
        //console.log("folderPath:", folderPath);
        ensureDirectoryExistence(folderPath);
        cb(null, folderPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = upload;



// const multer = require('multer')
// const path = require("path")

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, "src/storage/documents/")
//     },
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })

// const upload = multer({ storage })

// module.exports = upload