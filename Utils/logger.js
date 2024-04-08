import chalk from "chalk";
import morganBody from "morgan-body";

const overrideInfo = () => {
    if (process.env.PRINT_CONSOLE_INFO == "false") {
        return (console.log = function () {});
    }

    var log = console.log;
    console.log = function (...e) {
        try {
            throw new Error();
        } catch (error) {
            const fileName = getFileNameFromError(error);
            log.apply(console, ["\n", "[" + new Date().toLocaleString() + "]", chalk.blue("INFO:"), fileName, ...e]);
        }
    };
};

const overrideWarn = () => {
    if (process.env.PRINT_CONSOLE_WARN == "false") {
        return (console.warn = function () {});
    }
    var log = console.warn;
    try {
        throw new Error();
    } catch (error) {
        console.warn = function (...e) {
            const fileName = getFileNameFromError(error);
            log.apply(console, ["\n", "[" + new Date().toLocaleString() + "]", chalk.yellow("WARN:"), fileName, ...e]);
        };
    }
};

const overrideError = () => {
    if (process.env.PRINT_CONSOLE_ERROR == "false") {
        return (console.error = function () {});
    }
    var log = console.error;
    console.error = function (...e) {
        try {
            throw new Error();
        } catch (error) {
            const fileName = getFileNameFromError(error);
            log.apply(console, ["\n", "[" + new Date().toLocaleString() + "]", chalk.red("ERROR:"), fileName, ...e]);
        }
    };
};

const overrideDebug = () => {
    if (process.env.PRINT_CONSOLE_DEBUG == "false") {
        return (console.debug = function () {});
    }

    var log = console.debug;
    console.debug = function (...e) {
        try {
            throw new Error();
        } catch (error) {
            const fileName = getFileNameFromError(error);
            log.apply(console, ["\n", "[" + new Date().toLocaleString() + "]", chalk.magenta("DEBUG:"), fileName, ...e]);
        }
    };
};

const overrideSuccess = () => {
    if (process.env.PRINT_CONSOLE_SUCCESS == "false") {
        return (console.success = function () {});
    }

    var log = console.info;

    console.success = function (...e) {
        try {
            throw new Error();
        } catch (error) {
            const fileName = getFileNameFromError(error);
            log.apply(console, ["\n", "[" + new Date().toLocaleString() + "]", chalk.green("SUCCESS:"), fileName, ...e]);
        }
    };
};

const morgalApiLogger = (app) => {
    if (process.env.PRINT_API_REQ_RES == "false") return console.log(`API logger is turned OFF`);
    console.log(`API logger is turned ON`);
    morganBody(app, {
        prettify: false,
        includeNewLine: true,
        timezone: "Asia/Kolkata",
        logReqHeaderList: ["x-project-id"],
        skip: (req) => {
            return req.url.includes("management") || req.url.includes("favicon") || req.method === "OPTIONS";
        },
    });
};

const overrideConsole = () => {
    overrideInfo();
    overrideWarn();
    overrideError();
    overrideSuccess();
    overrideDebug();
};

const setupLogger = (app) => {
    morgalApiLogger(app);
    overrideConsole();
};
export default setupLogger;
export { morgalApiLogger, overrideConsole };

const getFileNameFromError = (error) => {
    return "[" + error.stack.split("\n")[2].split("/").at(-1).replace(/\)/, "") + "]";
};
