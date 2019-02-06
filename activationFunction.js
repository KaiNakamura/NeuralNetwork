class ActivationFunction {
  constructor(key, func, dfunc) {
    this.key = key;
    this.func = func;
    this.dfunc = dfunc;
  }
}

const ACTIVATION_FUNCTION = {
  SIGMOID: new ActivationFunction (
    "SIGMOID",
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
  ),
  TANH: new ActivationFunction (
    "TANH",
    x => Math.tanh(x),
    y => 1 - (y * y)
  )
}

function getActivationFunction(key) {
  for (let value in ACTIVATION_FUNCTION) {
    if (value == key)
      return ACTIVATION_FUNCTION[value];
  }

  throw "Activation function of key \'" + key + "\', not found";
}
