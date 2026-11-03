/* @layer core @kind config */
const PORT_BOUNDS = { min: 1024, max: 65535 };

const PORT_PROBLEM = `The port must be between ${PORT_BOUNDS.min} and ${PORT_BOUNDS.max}.`;

export { PORT_BOUNDS, PORT_PROBLEM };
