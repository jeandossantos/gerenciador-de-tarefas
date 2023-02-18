function existsOrError(value, msg, ClassError) {
  if (!value) throw new ClassError(msg);
  if (Array.isArray(value) && value.length === 0) throw new ClassError(msg);
  if (typeof value === 'string' && !value.trim()) throw new ClassError(msg);
}

function notExistsOrError(value, msg, ClassError) {
  try {
    existsOrError(value, msg);
  } catch (msg) {
    return;
  }
  throw new ClassError(msg);
}

function equalsOrError(valueA, valueB, msg, ClassError) {
  if (valueA !== valueB) throw new ClassError(msg);
}

export { existsOrError, notExistsOrError, equalsOrError };
