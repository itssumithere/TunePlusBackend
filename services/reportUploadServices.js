const settingModel = require("../models/settingmodels");
const R = require("../utils/responseHelper");
const AppErr = require("../utils/error");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const reportModel = require("../models/reportdatamodel");

const uploadController = {};

uploadController.reportUploadExcel = async (req, res, next) => {
    try {
        const { userId, toDate, fromDate } = req.body;
        console.log("Upload Request Body:", req.body);
        if (!toDate || !fromDate) {
            throw new AppErr("Both 'fromDate' and 'toDate' are mandatory.", 400);
        }

        const filePath = req.file?.path;
        console.log("Upload filePath:", filePath);
        if (!filePath) {
            throw new AppErr("No file provided or incorrect format.", 400);
        }

        const cloudinaryResult = await uploadOnCloudinary(filePath);
        if (!cloudinaryResult?.url) {
            throw new AppErr("File upload failed. Cloudinary did not return a valid URL.", 500);
        }

        // Create the document object first
        const reportData = {
            userId: userId,
            toDate: toDate,
            fromDate: fromDate,
            excelUrl: cloudinaryResult.url
        };

        console.log("Attempting to save report data:", reportData);

        // Use a different approach to create the document
        ///const newReport = new reportModel(reportData);

        const result = await reportModel.addReport(reportData);
        if (result == false) {
            return R(res, false, "Data not added successfully", {}, 400);
        }

        return R(res, true, "Excel uploaded and processed successfully!", result, 201);
    } catch (error) {
        console.error("Upload Error:", error);
        return R(res, false, error.message || "Internal Server Error", error.statusCode || 500);
    }
}

uploadController.getReport = async (req, res, next) => {
    try {
        const { userId } = req.body;
        console.log("getReport Request Body:", req.body);
        if (!userId) {
            throw new AppErr("userId is mandatory.", 400);
        }
        
        // Create filter object with userId
        const filter = { userId };
        
        
        
        const result = await reportModel.getReport(filter);
        if (result == false) {
            return R(res, false, "Data not found", {}, 400);
        }
        return R(res, true, "Data found", result, 200);

    } catch (error) {
        next(error);
    }
}

uploadController.deleteReport = async (req, res, next) => {
    try {
        const { reportId } = req.body;
        console.log("deleteReport Request Body:", req.body);
        if (!reportId) {
            throw new AppErr("'reportId' are mandatory.", 400);
        }
        const filter = {_id: reportId };
        const result = await reportModel.deleteReport(filter);
        if (result == false) {
            return R(res, false, "Data not found", {}, 400);
        }
        return R(res, true, "Data deleted", result, 200);
    } catch (error) {
        next(error);
    }
}
module.exports = uploadController;
