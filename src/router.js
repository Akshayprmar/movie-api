// Defines an express app that runs the boilerplate codebase.

import bodyParser from "body-parser";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import { ApplicationError } from "./lib/errors";
import {
  create as createUserRoute,
  list as listUsersRoute,
} from "./routes/users";
import {
  authenticate as authenticateRoute,
  verify as verifySessionMiddleware,
} from "./routes/sessions";

import {getmovies,createmovie,deletemovie,updatemovie} from './routes/films'
export default function createRouter() {
  // *********
  // * SETUP *
  // *********

  const router = express.Router();

  // static assets, served from "/public" on the web
  router.use("/public", express.static(path.join(__dirname, "..", "public")));

  router.use(cookieParser()); // parse cookies automatically
  router.use(bodyParser.json()); // parse json bodies automatically

  /**
   * Uncached routes:
   * All routes that shouldn't be cached (i.e. non-static assets)
   * should have these headers to prevent 304 Unmodified cache
   * returns. This middleware applies it to all subsequently
   * defined routes.
   */
  router.get("/*", (req, res, next) => {
    res.set({
      "Last-Modified": new Date().toUTCString(),
      Expires: -1,
      "Cache-Control": "must-revalidate, private",
    });
    next();
  });

  // *****************
  // * API ENDPOINTS *
  // *****************

  
  /*
   * users endpoints
   */
  // the sessions.verify middleware ensures the user is logged in
  router.get("/api/users", verifySessionMiddleware, listUsersRoute);
  router.post("/api/users", createUserRoute);

  /*
   * Movies endpoints
   */

  router.get("/api/movie/", getmovies);
  router.post("/api/movie", createmovie);
  router.put("/api/movie/:id", createmovie);
  router.delete("/api/movie/:id", createmovie);

  // ******************
  // * ERROR HANDLING *
  // ******************

  // 404 route
  router.all("/*", (req, res, next) => {
    next(new ApplicationError("Not Found", 404));
  });

  // catch all ApplicationErrors, then output proper error responses.
  //
  // NOTE: express relies on the fact the next line has 4 args in
  // the function signature to trigger it on errors. So, don't
  // remove the unused arguments!
  router.use((err, req, res, next) => {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).send({
        message: err.message,
        data: err.data || {},
      });
      return;
    }

    // If we get here, the error could not be handled.
    // Log it for debugging purposes later.
    console.error(err);

    res.status(500).send({
      message: "Uncaught error",
    }); // uncaught exception
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
