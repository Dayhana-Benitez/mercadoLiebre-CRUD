const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destinantion: function(req, file, callack){
        callack(null, path.join(_dirname, '../../public/images/products'))
    },
    filnename: function(req, file, callBack){
        callBack(null, `${Date.now()}_img_${path.extname(file.originalname)}`)
    }

})
const uploadFile = multer({storage})

module.exports = uploadFile