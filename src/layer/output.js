import makeKernel from '../utilities/make-kernel';
import randos2D from '../utilities/randos-2d';
import zeros2D from '../utilities/zeros-2d';
import Base from './base';

export default class Output extends Base {
  constructor(settings, inputLayer) {
    super(settings);
    this.inputLayer = inputLayer;
    this.width = inputLayer.width;
    this.height = inputLayer.height;
    this.weights = randos2D(this.width, this.height);
    this.deltas = zeros2D(this.width, this.height);
    this.errors = zeros2D(this.width, this.height);
  }

  setupKernels() {
    const compareFn = this.height === 1
      ? compare1D
      : compare2D;
    this.compareKernel = makeKernel(compareFn, {
      output: [this.width, this.height]
    });
  }

  predict() {}

  compare(targetValues) {
    // this is where weights attach to deltas
    this.weights = this.inputLayer.weights;
    this.inputLayer.deltas = this.weights;
    this.errors = this.compareKernel(this.weights, targetValues);
  }

  learn(previousLayer, nextLayer, learningRate) {}
}

function compare1D(weights, targetValues) {
  return weights[this.thread.y][this.thread.x] - targetValues[this.thread.x];
}

function compare2D(weights, targetValues) {
  return weights[this.thread.y][this.thread.x] - targetValues[this.thread.y][this.thread.x];
}