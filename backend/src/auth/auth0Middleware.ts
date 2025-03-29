import { auth } from "express-oauth2-jwt-bearer";

export const checkJwt = auth({
  audience: "http://localhost:8000",
  issuerBaseURL: "https://dev-bcrhb5nfuwpmqlpa.us.auth0.com",
  tokenSigningAlg: "RS256"
});
