export function calculateCorrelation(x, y) {
  const n = x.length;
  if (n < 2) return 0;

  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xVariance += xDiff * xDiff;
    yVariance += yDiff * yDiff;
  }

  // Apply sample variance correction
  return (
    numerator /
    (n - 1) /
    Math.sqrt((xVariance / (n - 1)) * (yVariance / (n - 1)))
  );
}
