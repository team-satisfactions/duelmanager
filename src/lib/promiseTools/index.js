export async function waitFor(timeoutMilliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutMilliseconds);
  });
}
