//

// mock logger that swallows all informational messages.
// error-level messages are presumably unexpected so they are also sent to the console.
function dummyLogger() {
  var logger = {
    traces: [], debugs: [], infos: [], warns: [], errors: [],
  };
  logger.trace = function(...args) { logger.traces.push(args); };
  logger.debug = function(...args) { logger.debugs.push(args); };
  logger.info = function(...args) { logger.info.push(args); };
  logger.warn = function(...args) { logger.warns.push(args); };
  logger.error = function(...args) { console.error(...args); logger.errors.push(args); }; // eslint-disable-line no-console
  return logger;
}

// mock logger that swallows all messages, including error-level messages.
function captureLogger() {
  var logger = captureLogger;
  logger.error = function(...args) { logger.errors.push(args); };
  return logger;
}

function testNear(actual, expected, deltaLo = null, deltaHi = null) {
  if (deltaLo === null) { deltaLo = 0.001 * expected; }
  if (deltaHi === null) { deltaHi = deltaLo; }
  try {
    if ((actual >= (expected - deltaLo)) && (actual <= (expected + deltaHi))) {
      return true;
    }
  } catch (err) { console.error('error in testNear', err); } // eslint-disable-line no-console
  console.error('actual should be near expected', actual, expected, actual - expected, deltaLo, deltaHi); // eslint-disable-line no-console
  return false;
}

function testMatches(actual, expected) {
  try {
    if (expected.test(actual)) {
      return true;
    }
  } catch (err) { console.error('error in testMatches', err); } // eslint-disable-line no-console
  console.error('actual should match expected', actual, expected); // eslint-disable-line no-console
  return false;
}

module.exports = {
  dummyLogger, captureLogger, testNear, testMatches,
};
