import _ from "lodash";
import { classList } from "../classifier/imagenet";
import { MODEL_PATH } from "../constants";
import * as Jimp from "jimp";
import { Tensor, InferenceSession } from "onnxruntime-node";

const IMG_SIZE = 224;
const DEFAULT_DIMS = [1, 3, IMG_SIZE, IMG_SIZE];

const DEFAULT_OPTIONS = {
  dims: DEFAULT_DIMS,
};

interface ModelOptions {
  // decorators later
  verbose?: boolean;
  inferenceSessionOptions?: InferenceSession.SessionOptions;
  dims?: number[];
}

export class Model {
  private session: InferenceSession;

  constructor(
    private readonly opts: ModelOptions,
    private sessionCount: number = 0
  ) {
    this.opts = { ...DEFAULT_OPTIONS, ...this.opts };
    this.loadInferenceSession();
  }

  loadInferenceSession = async () => {
    if (this.opts?.verbose) console.log("Inference session created");
    this.session = await InferenceSession.create(
      MODEL_PATH,
      this.opts?.inferenceSessionOptions
    );
  };

  jimpFromPath = async (
    path: string,
    width: number = this.opts.dims![2],
    height: number = this.opts.dims![3]
  ): Promise<Jimp> => {
    const start = new Date();
    const imageData = await Jimp.default
      .read(path)
      .then((imageBuffer: Jimp) => {
        return imageBuffer.resize(width, height);
      });
    const end = new Date();
    const ttl = (end.getTime() - start.getTime()) / 1000;
    if (this.opts?.verbose) console.log(`time to load image: ${ttl}`);

    return imageData;
  };

  jimpFromData = async (
    data: string,
    width: number = this.opts.dims![2],
    height: number = this.opts.dims![3]
  ): Promise<Jimp> => {
    const start = new Date();
    const imageData = await Jimp.read(Buffer.from(data, "base64")).then(
      (imageBuffer: Jimp) => {
        return imageBuffer.resize(width, height);
      }
    );
    const end = new Date();
    const ttl = (end.getTime() - start.getTime()) / 1000;
    if (this.opts?.verbose) console.log(`time to load image: ${ttl}`);

    return imageData;
  };

  imageDataToTensor = (
    image: Jimp,
    dims: number[] = this.opts.dims!
  ): Tensor => {
    const imageBufferData = image.bitmap.data;
    const [redArray, greenArray, blueArray] = new Array(
      new Array<number>(),
      new Array<number>(),
      new Array<number>()
    );

    for (let i = 0; i < imageBufferData.length; i += 4) {
      redArray.push(imageBufferData[i]);
      greenArray.push(imageBufferData[i + 1]);
      blueArray.push(imageBufferData[i + 2]);
    }

    const transposedData = redArray.concat(greenArray).concat(blueArray);

    let i,
      l = transposedData.length;
    const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);
    for (i = 0; i < l; i++) {
      float32Data[i] = transposedData[i] / 255.0;
    }
    const inputTensor = new Tensor("float32", float32Data, dims);
    return inputTensor;
  };

  submitInference = async (image: Jimp): Promise<any> => {
    const [inferenceResult, inferenceTime] = await this.inferenceSqueezenet(
      image
    );
    const best = inferenceResult[0];

    return { best, inferenceTime };
  };

  inferenceSqueezenet = async (image: Jimp): Promise<[any, number]> => {
    const data = this.imageDataToTensor(image);
    const [predictions, inferenceTime] = await this.runSqueezenetModel(data);
    return [predictions, inferenceTime];
  };

  runSqueezenetModel = async (
    preprocessedData: any
  ): Promise<[any, number]> => {
    const [results, inferenceTime] = await this.runInference(
      this.session,
      preprocessedData
    );
    return [results, inferenceTime];
  };

  runInference = async (
    session: InferenceSession,
    preprocessedData: any
  ): Promise<[any, number]> => {
    const start = new Date();
    const feeds: Record<string, Tensor> = {};
    feeds[session.inputNames[0]] = preprocessedData;

    const outputData = await session.run(feeds);
    const end = new Date();
    const inferenceTime = (end.getTime() - start.getTime()) / 1000;
    if (this.opts?.verbose) console.log("Inference time: " + inferenceTime);

    const output = outputData[session.outputNames[0]];
    const results = prediction(output, 5);

    return [results, inferenceTime];
  };
}

const prediction = (classProbabilities: any, k = 5) => {
  const probs = _.isTypedArray(classProbabilities)
    ? Array.prototype.slice.call(classProbabilities)
    : classProbabilities;

  const sorted = _.reverse(
    _.sortBy(
      probs.map((prob: any, index: number) => [prob, index]),
      (probIndex: Array<number>) => probIndex[0]
    )
  );

  const topK = _.take(sorted, k).map((probIndex: Array<number>) => {
    const iClass = classList[probIndex[1]];
    return {
      id: iClass[0],
      index: parseInt(probIndex[1].toString(), 10),
      name: iClass[1].replace(/_/g, " "),
      probability: probIndex[0],
    };
  });
  return topK;
};
