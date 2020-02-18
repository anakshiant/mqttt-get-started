// Defines an express app that runs the boilerplate codebase.

import bodyParser from "body-parser";
import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { ApplicationError } from "./lib/errors";
// import { verify as verifyMiddleware } from "./routes/sessions";
import { create as signupUser, login as loginUserRoutes } from "./routes/user";

// import {
//   create as addFarmerRoute,
//   getFarmerByColdId as getAllFarmerByColdId,
//   getFarmerDetails as getFarmerByFarmerId,
//   editFarmer as editFarmerRoute
// } from "./routes/farmer";

// import {
//   create as addOrderRoute,
//   put as editOrderRoute,
//   getOrdersByFarmerId as getOrdersByFarmerIdRoute
// } from "./routes/order";

// import {
//   create as addTransactionRoute,
//   put as editTransactionRoute,
//   getTransactionByFarmerId as getTransactionsByFarmerIdRoute
// } from "./routes/transaction";
// import { getLocationByPincode } from "./routes/pincode";
export default function createRouter() {
  // *********
  // * SETUP *
  // *********

  const router = express.Router();
  // router.use(cookieParser()); // parse cookies automatically
  // parse json bodies automatically
  router.use(bodyParser.json({ limit: "250mb" }));
  router.use(bodyParser.urlencoded({ extended: false, limit: "250mb" }));
  router.use(compression());
  router.use(cors({ origin: "*" }));
  router.use(helmet());

  /**
   * Uncached routes:
   * All routes that shouldn't be cached (i.e. non-static assets)
   * should have these headers to prevent 304 Unmodified cache
   * returns. This middleware applies it to all subsequently
   * defined routes.
   */
  router.use("*", (req, res, next) => {
    console.log(req.originalUrl);
    // res.set({
    //   "Last-Modified": new Date().toUTCString(),
    //   Expires: -1,
    //   "Cache-Control": "must-revalidate, private"
    // });
    next();
  });

  // *****************
  // * API ENDPOINTS *
  // *****************

  /*
   * sessions endpoints
   */
  // authenticate. Returns a json web token to use with requests.
  /*
   * users endpoints
   */
  // the sessions.verify middleware ensures the user is logged in
  router.post("/signup", signupUser);

  router.post("/login", loginUserRoutes);
  router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/login.html"));
  });
  router.post("/token", (req, res) => {
    console.log(req.url);
    res.json({ token: "aakarsh" });
  });
  // ******************
  // * ERROR HANDLING *
  // ******************

  // 404 route
  router.all("/*", (req, res, next) => {
    console.log(req.baseUrl);
    next(new ApplicationError("Not Found", 404));
  });

  // catch all ApplicationErrors, then output proper error responses.
  //
  // NOTE: express relies on the fact the next line has 4 args in
  // the function signature to trigger it on errors. So, don't
  // remove the unused arguments!
  router.use((err, req, res, next) => {
    res.status(err.statusCode).send({
      message: { errMsg: err.message, errCode: err.statusCode }
    });
    return;

    // If we get here, the error could not be handled.
    // Log it for debugging purposes later.
  });

  // *******************
  // * CATCH ALL ROUTE *
  // *******************

  /**
   * If you want all other routes to render something like a one-page
   * frontend app, you can do so here; else, feel free to delete
   * the following comment.
   */
  /*
   * function renderFrontendApp(req, res, next) {
   *   // TODO: add code to render something here
   * }
   * // all other pages route to the frontend application.
   * router.get('/*', renderFrontendApp);
   */

  return router;
}
