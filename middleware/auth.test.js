"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin
} = require("./auth");


const { SECRET_KEY } = require("../config");

const testJwt = jwt.sign({ username: "test", is_admin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", is_admin: false }, "wrong");
const adminJwt = jwt.sign({ username: "test", is_admin: true }, SECRET_KEY);



describe("authenticateJWT", function () {
  test("works: via header", function () {
    expect.assertions(2);
     //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        is_admin: false,
      },
    });
  });

  test("works: no header", function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});


describe('ensureAdmin', function() {
  test("works when user is an admin", function() {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: true } } };
    const next = function(err) {
      expect(err).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test("throws error when user is not an admin", function() {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function(err) {
      expect(err).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });
});


describe("ensureCorrectUserOrAdmin", function() {
  test("works when user is admin", function() {
    expect.assertions(1);
    const req = { params: {username: "test"} };
    const res = { locals: { user: { username: "admin", is_admin: true } } };
    const next = function(err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("works when user is the correct user", function() {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function(err) {
      expect(err).toBeFalsy()
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("throws error when user is neither admin nor correct user", function() {
    expect.assertions(1);
    const req = { params: { username: "otherUser" } };
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function(err) {
      expect(err.message).toBe("Unauthorized access");
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });
});






