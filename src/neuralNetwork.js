var nextNeuralNetworkID = 0;

class NeuralNetwork {
  constructor(arg) {
    this.ID = NeuralNetwork.newID();

    this.layers = [];

    // If copying
    if (arg instanceof NeuralNetwork) {
      for (let i in arg.layers)
        this.layers[i] = arg.layers[i].copy();

      // Connect layers
      for (let i = 0; i < this.layers.length - 1; i++)
        this.layers[i].connectTo(this.layers[i + 1], arg.layers[i]);
    }
    // If loading from array of layers
    else if (arg instanceof Array && arg[0] instanceof Layer) {
      for (let i in arg)
        this.layers[i] = arg[i];
    }
    // If creating with array of sizes
    else {
      for (let i in arg)
        this.layers[i] = new Layer(arg[i]);

      // Connect layers
      for (let i = 0; i < this.layers.length - 1; i++)
        this.layers[i].connectTo(this.layers[i + 1]);
    }
  }

  activate(inputs) {
    if (typeof inputs == 'undefined')
      this.layers[0].activate();
    else
      this.layers[0].activate(inputs);

    for (var i = 1; i < this.layers.length - 1; i++)
      this.layers[i].activate();

    return this.layers[this.layers.length - 1].activate();
  }

  mutate(rate) {
    for (var i = 0; i < this.layers.length; i++)
      this.layers[i].mutate(rate);
  }

  copy() {
    return new NeuralNetwork(this);
  }

  stringify() {
    return JSON.stringify(this, function(key, value) {
      if (key == 'ID') {
        return undefined;
      }
      else if (key == 'state') {
        return undefined;
      }
      else if (key == 'input' || key == 'output') {
        return value.ID;
      }
      else if (key == 'activationFunction') {
        return value.key;
      }
      else {
        return value;
      };
    });
  }

  static parse(str) {
    let obj = JSON.parse(str);

    // Create layers
    let layers = [];
    for (let i in obj.layers) {
      // Create neurons
      let neurons = [];
      for (let j in obj.layers[i].neurons) {
        neurons[j] = new Neuron(obj.layers[i].neurons[j]);
      }

      layers[i] = new Layer(neurons);
    }

    // Connect layers
    for (let i = 0; i < layers.length - 1; i++) {
      let layer = layers[i];

      for (let j in layer.neurons) {
        let neuron = layers[i].neurons[j];
        for (let k in layers[i + 1].neurons) {
          neuron.connectTo(layers[i + 1].neurons[k], neuron.weights[0]);
          neuron.weights.splice(0, 1);
        }

        delete neuron.weights;
      }
    }


    return new NeuralNetwork(layers);
  }

  save() {
    let file = new Blob([this.stringify()]);
    let fileName = "network.json";

    if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, fileName);
    else { // Others
      let a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  // Creates a promise that is resolved after file is selected
  // To access the neural network created use:
  // let nn;
  // NeuralNetwork.load().then(function(result) {nn = result});
  static load() {
    // Create file input
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.visibility = "hidden"; // Hide it
    fileInput.style.position = "absolute"; // Make sure it doesn't mess up page

    let promise = new Promise(function(resolve, reject) {
      // When file selected
      fileInput.onchange = function() {
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          let reader = new FileReader();
          reader.onload = function() {
            resolve(NeuralNetwork.parse(reader.result));
          };

          reader.readAsText(fileInput.files[0]);
        } else {
          alert('The File APIs are not fully supported in this browser.');
        }
      };
    });


    document.body.appendChild(fileInput);

    // Click the file input automatically
    fileInput.click();

    return promise;
  }

  static newID() {
    return nextNeuralNetworkID++;
  }
}
