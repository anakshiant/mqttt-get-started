const mqtt = require("mqtt");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const db = require("./db");

const { PORT, MQTT_HOST, MQTT_PORT } = process.env;

const app = express();
app.use(express.json());

// create client for mqtt
const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`);

// verify mqtt cient will connect
client.on("connect", function() {
  console.log("connected");
});

// create a device which will save client indexed by it's mac address // req {macAddress:"xxxx"}
app.use("*", (req, res, next) => {
  console.log(req.originalUrl);
  next();
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/login.html"));
});
// create a device which will save client indexed by it's mac address
// req {macAddress:"xxxx"}
app.post("/", (req, res) => {
  const device = db.addDevice(req.body.macAddress);
  res.status(200).json(device);
});

// get topic by it's mac address
// useless
app.get("/:mac", (req, res) => {
  const device = db.getDevice(req.params.mac);
  if (device) {
    res.status(200).json(device);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

// send post body {mac:'',message:''} and it will publish to device topic
app.post("/publish", (req, res) => {
  const device = db.getDevice(req.body.mac);
  console.log(device);
  console.log(req.body);
  if (device) {
    client.publish(device.topic, req.body.message);
  }
  res.status(200).send({ done: true });
});

// well congrats
app.listen(PORT, () => {
  console.log("ok app is running", PORT);
});
