"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


// Middleware to use to make sure admin has access to a feature
function ensureAdmin(req, res, next) {
  try {
    if(!res.locals.user || !res.local.user.is_Admin) {
      throw new UnauthorizedError("User is not an admin", 403)
    }else{
      return next()
    }
  }catch(e) {
    return next(e)
  }
}

// Middleware to make sure either admin or a logged-user can have access to features
function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const { user } = res.locals;
    if(!(user && (user.is_admin || user.username === req.params.username))) {
      throw new UnauthorizedError("Unauthorized access", 401)
    }
    return next()
  }catch(e){
    return next(e)
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin
};
