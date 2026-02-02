// Suppress AWS SDK v2 deprecation warnings in tests
// Note: @aws/dynamodb-data-mapper requires AWS SDK v2
// This is a known limitation until the library is updated for v3
const originalEmitWarning = process.emitWarning;
process.emitWarning = function (warning, ...args) {
  if (
    typeof warning === 'string' &&
    (warning.includes('AWS SDK for JavaScript (v2)') || warning.includes('maintenance mode'))
  ) {
    return;
  }
  return originalEmitWarning.call(process, warning, ...args);
};

const originalEmit = process.emit;
process.emit = function (event: string | symbol, ...args: any[]) {
  if (event === 'warning') {
    const warning = args[0];
    if (
      warning &&
      typeof warning === 'object' &&
      'message' in warning &&
      typeof warning.message === 'string' &&
      (warning.message.includes('AWS SDK for JavaScript (v2)') ||
        warning.message.includes('maintenance mode'))
    ) {
      return false;
    }
  }
  return originalEmit.call(process, event, ...args);
};
