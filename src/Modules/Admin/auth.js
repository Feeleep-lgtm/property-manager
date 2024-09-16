import { prisma } from "../../../app.js";
import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";
import { JWT_SECRET } from "../../secrets.js";
import crypto from "crypto";
//import mailOptions from "../../utils/sendMail.js";
import sendMail from "../../services/email.service.js";
import { BadRequests } from "../../exception/bad-request.js";
import { ErrorCodes } from "../../exception/root.js";
import { NotFound } from "../../exception/not-found.js";
import { addUserToFirestore } from "../Chat/chat.userServices.js";

// export const signUp = async(req, res, next) => {
//     try{

//         const {email} = req.body
//         const admin = await prisma.jodexAdmin.findFirst({where: email})
//         if(admin){
//             res.status
//         }
//         const newAdmin = await prisma.jodexAdmin.create({})
//     } catch(err) {next(err)}
// }
