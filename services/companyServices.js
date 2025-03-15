const walletModel = require('../models/withdrawalmodel');
const transcationModel = require('../models/transaction');
const bcrypt = require("../utils/bcrypt")
const jwt = require("jsonwebtoken");
const R = require("../utils/responseHelper");
const validateInput = require("../helper/emailmobileVal")
const sendOtpEmail = require("../utils/Sendgrid")
const IP = require('ip');
// const companyModel = require("../models/companymodels");
const authModel = require("../models/authmodels");
const { generateRandomPassword } = require('../utils/genratepassword');
const auth = {};
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Hostinger's SMTP server
  port: 465, // Use 465 for SSL or 587 for STARTTLS
  secure: true, // Use true for SSL and false for STARTTLS
    auth: {
        user: process.env.EMAIL_USER, // Your email from environment variables
        pass: process.env.EMAIL_PASSWORD, // Your email password from environment variables
    },

});
auth.addCompany = async (req, res, next) => {
  const {
    aadharNo,
    city,
    companyName,
    country, email,
    firstName, language,
    lastName, panNo,
    phoneNumber, postalAddress,
    postalCode, role,
    royaltiesEmail,noOfLabel
  } = req.body;

  const now = new Date();
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  const futureTimeInMillis = futureDate.getTime();
  const ipAddress = IP.address();

  try {
    // Check if email already exists
    let isUserExist = await authModel.checkAvailablity(email);
    if (isUserExist?.length > 0) {
      return R(res,false,"Email already exists","",400);
    }

    const newPassword = generateRandomPassword(12); // Random password generator function

    const newUser = {
      email,
      name:firstName + " "+lastName,
      phone:phoneNumber,
      password:await bcrypt.passwordEncryption(firstName+"@123!", 12), // Encrypt password
      noOfLabel: noOfLabel,
      panNo: panNo || "",
      aadharNo: aadharNo || "",
      role: role || "company",
      is_deleted: 0,
      ip_address: ipAddress || "0.0.0.0",
      create_at: futureTimeInMillis,
      is_active: 1,
      clientNumber:Math.floor(10000000 + Math.random() * 90000000),
      companyName: companyName || "",
      mainEmail: email || "",
      royaltiesEmail: royaltiesEmail || "",
      firstName: firstName || "",
      lastName: lastName || "",
      postalAddress: postalAddress || "",
      postalCode: postalCode || "",
      city: city || "",
      country: country || "",
      language: language || "",
    };

    const register = await authModel.addCompany(newUser);

    if (!register) {
      return R(res,false,"Failed to register Company!","",400);
    }

    // Send Email with Password
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform",
      // text: `Thanks for being part of us. Your email for login is ${email} and your password is ${firstName+"@123!"}.`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #121212;
            margin: 0;
            padding: 0;
            color: #ffffff;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #1e1e1e;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header img {
            max-width: 150px;
          }
          .content {
            text-align: center;
            font-size: 16px;
            color: #e0e0e0;
          }
          .login-box {
            margin: 20px 0;
            padding: 10px;
            background-color: #2b2b2b;
            border: 1px solid #444;
            border-radius: 4px;
            text-align: left;
          }
          .login-box span {
            font-weight: bold;
            color: #ffffff;
          }
          .login-button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 20px;
          }
          .login-button:hover {
            background-color: #0056b3;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://ibb.co/frP3bq5" alt="Company Logo">
          </div>
          <div class="content">
            <p>Hello <strong>${firstName}</strong>,</p>
            <p>Your account has been created. Please find your temporary login details below:</p>
            <div class="login-box">
              <p><span>Username:</span> ${email}</p>
              <p><span>Password:</span>${firstName+"@123!"}</p>
            </div>
            <p>Once Logged in ,You will be able to set a prsonalized and secure password.</p>
            <p>with these log in details , you can now connect to:</p>
            <h3>Click to Login</h3>
            <a href="https://workplace.tuneplus.org/" class="login-button">Log In</a>
          </div>
          <div class="footer">
            <p>&copy; 2025  Tune Plus . All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`
    };

    try {
      const emailResponse = await transporter.sendMail(mailOptions);
      console.log("Email sent:", emailResponse);
      return R(res,true,`Account created successfully! Login details sent to ${email}.`,"",200);
    } catch (error) {
      console.error("Error sending email:", error.message);
      return R(res,false, "Failed to send email. Account created but no email sent.","",500);
    }
  } catch (err) {
    next(err);
  }
};

// auth.addCompany = async (req, res, next) => {
//     const { email, phone, name, role ,panNo,aadharNo ,companyName,
//         mainEmail,
//         royaltiesEmail,
//         firstName,
//         lastName,
//         postalAddress,
//         postalCode,
//         city,
//         country,
//         timeZone,
//         language } = req.body
//     // console.log("newUsernewUsernewUsernewUser",req.body.email)

//     const now = new Date();
//     const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
//     const futureTimeInMillis = futureDate.getTime()
//     const ipAddress = IP.address();
//     try {
//         let isUserExist = await authModel.checkAvailablity(email)
//         if (isUserExist?.length > 0) {
//             return R(res, false, "Email Id already exists!!", {}, 406)
//         }
//         const newPassword = generateRandomPassword(12);
//         const newUser = {
//             email: email,
//             name: name,
//             phone: phone,
//             password: await bcrypt.passwordEncryption(newPassword),
//             noOfLabel: noOfLabel || "",
//             panNo: panNo || "",
//             aadharNo: aadharNo || "",
//             role: role || "company",
//             is_deleted: 0,
//             ip_address: ipAddress || "0.0.0.0",
//             create_at: futureTimeInMillis,
//             is_active: 1,
//             clientNumber: Date.now(),
//             companyName: companyName || "",
//             mainEmail: mainEmail || "",
//             royaltiesEmail: royaltiesEmail || "",
//             firstName: firstName || "",
//             lastName: lastName || "",
//             postalAddress: postalAddress || "",
//             postalCode: postalCode || "",
//             city: city || "",
//             country: country || "",
//             // timeZone: timeZone || "",
//             language: language || "",
//         };


//         const register = await authModel.addCompany(newUser)

//         if(!register){
//             return R(res, false, "Failed to register Company!!", {}, 500)
//         }

//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "Password Reset OTP",
//             text: `thanks being part of us . your email for login is ${email} and paswword is ${newPassword} `,
//           };

//           // Send email
//           try {
//             const emailResponse = await transporter.sendMail(mailOptions);
//             console.log("Email sent:", emailResponse);
//             res.status(200).json({ success: true, message: ` Email of id , password is sent to ${email} .` });
//           } catch (error) {
//             console.error("Error sending email:", error);
//             res.status(500).json({ success: false, message: "Failed to  send Email But Account is Created" });
//           }
//     } catch (err) {
//         next(err)
//     }
// };


// auth.getUsers = async (req, res, next) => {

//     try {
//         const get = await authModel.getUser(req.doc.userId)
//         if (!get) {
//             return R(res, false, "No data found!!", {}, 200)
//         }
//         return R(res, true, "Data successfully!!", get, 200)
//     } catch (error) {
//         next(error)
//     }
// };
// auth.passwordChange = async (req, res, next) => {
//     const { newPassword, oldPassword } = req.body

//     try {
//         const result = await authModel.changePassword(req.doc.userId, oldPassword, newPassword);
//         if (!result) {
//             return R(res, false, "old password is not correct", "", 400)
//         }

//         return R(res, true, "Update successfully!!", req.doc.userId, 200)
//     } catch (error) {
//         next(error)
//     }
// };
// auth.profileUpdate = async (req, res, next) => {
//     try {
//         const id = req.doc.userId;
//         if (!id) {
//             return R(res, false, "ID is required", {}, 400);
//         }

//         let data = req.body;
//         console.log(data);
//         if (!data) {
//             return R(res, false, "Data is required", {}, 400);
//         }

//         const profileData = authModel.updateProfile(id, data);

//         return R(res, true, "Profile updated successfully", profileData, 201);
//     } catch (error) {
//         next(error);
//     }
// }

// auth.is_deleted = async (req, res, next) => {
//     try {
//         const { userId } = req.body;

//         if (!userId) {
//             return R(res, false, "User ID is required", "", 400)
//         }

//         const update = await authModel.is_deleted(userId);

//         if (!update) {
//             return R(res, false, "User not found", "", 404)
//         }

//         return R(res, true, "User deleted successfully", "", 200)

//     } catch (error) {
//         next(error)
//     }
// }

// auth.userList = async (req, res, next) => { 
//     try {
//         const get = await authModel.userList()
//         if (!get) {
//             return R(res, false, "No data found!!", [], 200)
//         }
//         return R(res, true, "Data successfully!!", get, 200)
//     } catch (error) {
//         next(error)
//     }
// };

module.exports = auth;



