import { Request } from "express";
import { AuthResult } from "express-oauth2-jwt-bearer";

export interface JwtPayloadRequest<
  Params = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  auth?: AuthResult;
}
