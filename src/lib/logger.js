import winston from "winston";
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} :${
    info.req
  }`;
});
const logger = winston.createLogger({
  level: "info",
  format: combine(
    label({ label: `${process.env.NODE_ENV}:logs` }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  ]
});
logger.level = "silly";
export default logger;
