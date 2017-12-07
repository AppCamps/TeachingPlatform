export function isNumber(value, previousValue) {
  if (!value) {
    return '';
  }
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) return previousValue;
  return parsedValue;
}

export function isGreaterThan(min) {
  return (value, previousValue) => {
    if (!value) return '';
    const parsedValue = isNumber(value, previousValue);
    return parsedValue > min ? parsedValue.toString() : previousValue;
  };
}

export function isLowerThan(max) {
  return (value, previousValue) => {
    if (!value) return '';
    const parsedValue = isNumber(value, previousValue);
    return parsedValue < max ? parsedValue.toString() : previousValue;
  };
}

export function isInRange(min, max) {
  return (value, previousValue) => {
    if (!value) return '';

    const parsedValue = isNumber(value, previousValue);
    return parsedValue > min - 1 && parsedValue < max + 1 ? parsedValue.toString() : previousValue;
  };
}
