
import jwt from "jsonwebtoken";

// const generateToken = (userId, res) => {
//   const token = jwt.sign({ userId },"secret", {
//     expiresIn: "11d",
//   });
//   res.cookie('jwt',token,{
//     maxAge: 1000* 60 * 60 * 24 * 15,
//     httpOnly:true,
//     sameSite:"None",
//     path:"/",
//     // secure:process.env.NODE_ENV !== "development"
//     secure:true,
    
//   })
// };
// export const generateToken = (userId, res) => {
//   const token = jwt.sign({ userId }, "secret", {
//     expiresIn: "11d",
//   });
  
//   res.cookie('jwt', token, {
//     maxAge: 1000 * 60 * 60 * 24 * 11,  
//     httpOnly: true,
//     sameSite: "None",
//     path: "/",
//     secure: true,  
//     domain: "https://real-state-liard.vercel.app",  
//   });
// };
const generateToken = (userId, res,req) => {
  const token = jwt.sign({ userId },"secret", {
    expiresIn: "11d",
  });
  req.token = token
  res.setHeader('Authorization',`Bearer ${token}`)
  res.status(200)
};

export default generateToken;
 