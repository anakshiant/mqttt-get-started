const uuid = require("uuid/v4");
const devices = {};

exports.getDevice = macAddress => {
  console.log(devices);
  return devices[macAddress];
};

exports.addDevice = macAddress => {
  devices[macAddress] = {
    topic: `device-${uuid()}`
  };
  return devices[macAddress];
};
