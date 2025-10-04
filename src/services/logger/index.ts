import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import pino from "pino";
import pretty from "pino-pretty";

import { config } from "../../config";

const resolveDestination = (destination: string) => {
  if (destination === "stdout") {
    return 1;
  }

  const directory = dirname(destination);
  mkdirSync(directory, { recursive: true });

  return destination;
};

const getAppLogger = () => {
  if (config.LOG_DESTINATION && config.LOG_LEVEL) {
    const prettyStream = pretty({
      destination: resolveDestination(config.LOG_DESTINATION),
      ignore: "pid,hostname",
      customColors:
        "fatal:red,error:red,core:magenta,coreDebug:blue,request:cyan,info:green,debug:black,plugin:white,warn:yellow",
    });

    const appLogger = pino(
      {
        level: config.LOG_LEVEL,
      },
      prettyStream
    );

    return appLogger;
  }

  return {
    error: () => {},
    info: () => {},
    warn: () => {},
    debug: () => {},
    trace: () => {},
  };
};

export const logger = getAppLogger();
