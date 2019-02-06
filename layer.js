var nextLayerID = 0

class Layer {
  constructor(arg) {
    this.ID = Layer.newID();

    this.neurons = [];

    // If copying
    if (arg instanceof Layer) {
      for (let i in arg.neurons)
        this.neurons[i] = arg.neurons[i].copy();
    }
    // If loading from array of neurons
    else if (arg instanceof Array && arg[0] instanceof Neuron) {
      for (let i in arg)
        this.neurons[i] = arg[i];
    }
    // If creating with size
    else {
      for (let i = 0; i < arg; i++)
        this.neurons[i] = new Neuron();
    }
  }

  activate(inputs) {
    var activation = [];

    if (typeof inputs == 'undefined') {
      for (var i = 0; i < this.neurons.length; i++)
        activation[i] = this.neurons[i].activate();
    }
    else {
      if (inputs.length != this.neurons.length)
        throw "Layer cannot activate with inputs of length " + inputs.length +
        " and neurons of length " + this.neurons.length + ".";

      for (var i = 0; i < this.neurons.length; i++)
        activation[i] = this.neurons[i].activate(inputs[i]);
    }

    return activation;
  }

  connectTo(other, template) {
    if (typeof template == 'undefined') {
      for (let i in this.neurons) {
        for (let j in other.neurons) {
          this.neurons[i].connectTo(other.neurons[j]);
        }
      }
    }
    else {
      if (template.neurons.length != this.neurons.length)
        throw "Template must have same size as original";
      for (let i in this.neurons) {
        for (let j in other.neurons) {
          let weights = [];
          for (var id in template.neurons[i].outputs) {
            weights.push(template.neurons[i].outputs[id].weight);
          }
          this.neurons[i].connectTo(other.neurons[j], weights[j]);
        }
      }
    }
  }

  mutate(rate) {
    for (var i = 0; i < this.neurons.length; i++) {
      var neuron = this.neurons[i];
      neuron.mutate(rate);

      for (var id in neuron.inputs)
        neuron.inputs[id].mutate(rate);
    }
  }

  copy() {
    return new Layer(this);
  }

  static newID() {
    return nextLayerID++;
  }
}
