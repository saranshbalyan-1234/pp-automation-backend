import chalk from 'chalk';

const overrideInfo = () => {
  if (process.env.PRINT_CONSOLE_INFO === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }

  const { log } = console;
  console.log = (...e) => {
    try {
      throw new Error();
    } catch (error) {
      const fileName = getFileNameFromError(error);
      log.apply(console, [ `[${new Date().toLocaleString()}]`, chalk.blue('INFO:   '), fileName, ...e]);
    }
  };
};

const overrideWarn = () => {
  if (process.env.PRINT_CONSOLE_WARN === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }
  const log = console.warn;
  try {
    throw new Error();
  } catch (error) {
    console.warn = (...e) => {
      const fileName = getFileNameFromError(error);
      log.apply(console, [ `[${new Date().toLocaleString()}]`, chalk.yellow('WARN:   '), fileName, ...e]);
    };
  }
};

const overrideError = () => {
  if (process.env.PRINT_CONSOLE_ERROR === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }
  const log = console.error;
  console.error = (...e) => {
    try {
      throw new Error();
    } catch (error) {
      const fileName = getFileNameFromError(error);
      log.apply(console, [ `[${new Date().toLocaleString()}]`, chalk.red('ERROR:  '), fileName, ...e]);
    }
  };
};

const overrideDebug = () => {
  if (process.env.PRINT_CONSOLE_DEBUG === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }

  const log = console.debug;
  console.debug = (...e) => {
    try {
      throw new Error();
    } catch (error) {
      const fileName = getFileNameFromError(error);
      log.apply(console, [ `[${new Date().toLocaleString()}]`, chalk.magenta('DEBUG:  '), fileName, ...e]);
    }
  };
};

const overrideSuccess = () => {
  if (process.env.PRINT_CONSOLE_SUCCESS === 'false') {
    console.log = () => {
      // Do nothing.
    };
  }

  const log = console.info;

  console.success = (...e) => {
    try {
      throw new Error();
    } catch (error) {
      const fileName = getFileNameFromError(error);
      log.apply(console, [ `[${new Date().toLocaleString()}]`, chalk.green('SUCCESS:'), fileName, ...e]);
    }
  };
};

const overrideConsole = () => {
  overrideInfo();
  overrideWarn();
  overrideError();
  overrideSuccess();
  overrideDebug();
};

export default overrideConsole;

const getFileNameFromError = (error) => {
  const str = `[${error.stack.split('\n')[2].split('/').at(-1).replace(/\)/, '')}]`.substring(0,30)
  const fixedStr = str + new Array(31 - str.length).fill('\xa0').join('')
  return fixedStr
};
