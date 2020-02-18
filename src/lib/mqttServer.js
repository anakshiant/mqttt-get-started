import dotenv from "dotenv";
dotenv.config();
import mqtt from "mqtt";

const { MQTT_HOST, MQTT_PORT } = process.env;

// create client for mqtt
export const client = mqtt.connect(`mqtt://${MQTT_HOST}:${MQTT_PORT}`);
// verify mqtt cient will connect
export function startMqtt() {
  client.on("connect", function() {
    console.log("connected");
  });
}
