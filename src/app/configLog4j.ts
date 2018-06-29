import {LFService, LoggerFactory, LoggerFactoryOptions, LogGroupRule, LogLevel} from "typescript-logging";
import * as config from "./config";

const level = config.logLevel ? LogLevel.fromString(config.logLevel) : LogLevel.Info;

const options = new LoggerFactoryOptions()
    .addLogGroupRule(new LogGroupRule(new RegExp(".+"), level));

export const logFactory = LFService.createNamedLoggerFactory("LoggerFactory", options);
export const serviceLog = logFactory.getLogger("service");
