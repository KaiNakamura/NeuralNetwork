var nextNeuronID = 0;

class Neuron {
  constructor(arg) {
    this.ID = Neuron.newID();

    this.inputs = {};
    this.outputs = {};

    this.state = 0;

    // If copying
    if (arg instanceof Neuron) {
      this.bias = arg.bias;
      this.activationFunction = arg.activationFunction;
    }
    // If loading
    else if (arg instanceof Object) {
      this.bias = arg.bias;
      this.activationFunction = getActivationFunction(arg.activationFunction);

      // Temp property for loading
      this.weights = [];
      for (let i in arg.outputs)
        this.weights.push(arg.outputs[i].weight);
    }
    // If creating
    else {
      // Randomize bias between -1 and 1
      this.bias = Math.random() * 2 - 1;

      this.activationFunction = ACTIVATION_FUNCTION.SIGMOID;
    }
  }

  activate(input) {
    if (typeof input != 'undefined') {
      this.activation = input;
    }
    else if (typeof this.activation == 'undefined' || Object.keys(this.inputs).length != 0) {
      this.state = 0;
      for (var i in this.inputs) {
        let connection = this.inputs[i];
        this.state += connection.input.activation * connection.weight;
      }

      this.activation = this.activationFunction.func(this.state + this.bias);
    }

    return this.activation;
  }

  connectTo(other, weight) {
    return new Connection(this, other, weight);
  }

  mutate(rate) {
    this.bias = mutate(rate, this.bias);
    return this.bias;
  }

  copy() {
    return new Neuron(this);
  }

  static newID() {
    return nextNeuronID++;
  }
}
