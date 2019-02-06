var nextConnectionID = 0;

class Connection {
  constructor(input, output, weight) {
    this.ID = Connection.newID();
    this.input = input;
    this.output = output;

    input.outputs[this.ID] = this;
    output.inputs[this.ID] = this;

    this.weight = typeof weight == 'undefined' ? Math.random() * 2 - 1 : weight;
  }

  mutate(rate) {
    this.weight = mutate(rate, this.weight);
    return this.weight;
  }

  copy() {
    return new Connection(this.input, this.output, this.weight);
  }

  static newID() {
    return nextConnectionID++;
  }
}
