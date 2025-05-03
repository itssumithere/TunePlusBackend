const express = require("express")
const router = express.Router();
const reportUploadServices = require("../services/reportUploadServices");
const verifyToken = require("../utils/verifyToken");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) { 
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage,
})

router.post('/reportExcel', upload.single('file'), reportUploadServices.reportUploadExcel)
router.post('/getReport', verifyToken, reportUploadServices.getReport)
router.post('/deleteReport', verifyToken, reportUploadServices.deleteReport)


module.exports = router 