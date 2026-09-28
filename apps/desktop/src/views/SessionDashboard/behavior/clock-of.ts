/* @layer renderer-app @kind logic */
const pad = (value: number) => String(value).padStart(2, '0');

const clockOf = (at: number) => {
  const date = new Date(at);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export { clockOf };
