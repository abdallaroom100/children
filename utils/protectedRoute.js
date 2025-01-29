import jwt from "jsonwebtoken"


// export const protectRoute = async (req, res, next) => {
//   try {
//    console.log(req.headers)
//     const token = req.headers.cookie?.split("jwt=").slice(-1)[0];
   
//     if (!token) throw new Error("unaturhorized token");
//     const decode = jwt.verify(token, "secret");
//     if (!decode) throw new Error("unaturhorized - invalid token");
//     req.userId = decode.userId;
//     next();
//   } catch (error) {
//     console.log("error in protect route function");
//     res.status(400).json({ error: error.message });
//   }
// };
export const protectRoute = async (req, res, next) => {
  try {
   console.log(req.headers)
    const token = req.headers["authorization"]?.split(" ")[1];
   
    if (!token) throw new Error("unaturhorized token");
    const decode = jwt.verify(token, "secret");
    if (!decode) throw new Error("unaturhorized - invalid token");
    req.userId = decode.userId;
    next();
  } catch (error) {
    console.log("error in protect route function");
    res.status(400).json({ error: error.message });
  }
};
