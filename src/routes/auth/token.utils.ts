import * as JwtService from "jsonwebtoken";
import { JwtPayload } from "../../types/jwtPayload.type";
import { Tokens } from "../../types/tokens.type";

const generateToken = (
  id: string,
  email: string,
  username: string,
  firstName: string,
  lastName: string
): Tokens => {
  const jwtPayload: JwtPayload = {
    id: id,
    email: email,
    username: username,
    firstName: firstName,
    lastName: lastName,
  }
  
  const at = JwtService.sign(jwtPayload, process.env.AT_SECRET || 'at_secret', {
    expiresIn: '7d'
  })

  return {
    access_token: at
  }
}

export default generateToken;
  