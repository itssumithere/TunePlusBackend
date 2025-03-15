const express = require("express")
const router = express.Router(); 
const verifyToken = require("../utils/verifyToken");
// const companyModel =require("./../models/companymodels")
const companyServices = require("../services/companyServices");

router.post('/addCompany', verifyToken,companyServices.addCompany) 
// router.get('/company-profile',verifyToken, companyModel.getcompanys) 
// router.post('/company-delete',verifyToken,companyModel.is_deleted);
// router.get('/company-list',verifyToken,companyModel.companyList);





// router.post('/get-otp',otpSendValidation, authService.getOtpForMobileAndEmail)
// router.post("/verifyOtp",otpVerifyValidation, authService.verifyOtp)



// router.get('/get-flash-message', flashService.getInArray)



// router.post("/change-forgot-password",forgotPasswordValidation,authService.forgotPassword)


module.exports = router 