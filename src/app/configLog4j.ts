import {LFService, LoggerFactory, LoggerFactoryOptions, LogGroupRule, LogLevel} from "typescript-logging";

const level = process.env.LOG_LEVEL ? LogLevel.fromString(process.env.LOG_LEVEL) : LogLevel.Info;

const options = new LoggerFactoryOptions()
    .addLogGroupRule(new LogGroupRule(new RegExp(".+"), level));

export const logFactory = LFService.createNamedLoggerFactory("LoggerFactory", options);
export const serviceLog = logFactory.getLogger("service");
