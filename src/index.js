// Defines an express app that runs the boilerplate codebase.

import dotenv from "dotenv";
dotenv.config();
import "babel-polyfill";

import express from "express";

import http from "http";

const { PORT } = process.env;
import createRouter from "./router";

import { startMqtt } from "./lib/mqttServer";
const app = express();

app.use(createRouter());
startMqtt();
http
  .createServer(app)
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
