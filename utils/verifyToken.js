var jwt = require("jsonwebtoken");
const R = require("./responseHelper");

// var apiResponse = require("../helpers/apiResponses");
const verifyJWT = (req, res, next) => {
  //console.log("req.headers.authorization",req.headers.authorization);
  try {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, verify) => {
        if (err) {
          let err = new Error("Unauthorized");
          err.status = 404;
          // throw err;
          return R(res, false, "Unauthorized !!", err, 404);
        } else {
          let decoded = jwt.decode(req.headers.authorization, {
            complete: true,
          });
          req.doc = decoded.payload;
          // console.log(req.doc);
          next();
        }
      }
    );
  } catch (e) {
    // console.log(e);
    // throw(e)
    return R(res, false, "Unauthorized !!", e, 404);
  }
};

module.exports = verifyJWT;
