import _ from "lodash";
import { classList } from "../classifier/imagenet";
import { MODEL_PATH } from "../constants";
import * as Jimp from "jimp";
import { Tensor, InferenceSession } from "onnxruntime-node";

const IMG_SIZE = 640;
const DEFAULT_DIMS = [1, 3, IMG_SIZE, IMG_SIZE];

const DEFAULT_OPTIONS = {
  dims: DEFAULT_DIMS,
};

export const jimpFromPath = async (
  path: string,
  width: number = IMG_SIZE,
  height: number = IMG_SIZE
): Promise<Jimp> => {
  const imageData = await Jimp.default.read(path).then((imageBuffer: Jimp) => {
    return imageBuffer.resize(width, height);
  });

  return imageData;
};

export const jimpFromData = async (
  data: string,
  width: number = IMG_SIZE,
  height: number = IMG_SIZE
): Promise<Jimp> => {
  const imageData = await Jimp.read(Buffer.from(data, "base64")).then(
    (imageBuffer: Jimp) => {
      return imageBuffer.resize(width, height);
    }
  );

  return imageData;
};

export const imageDataToTensor = (
  image: Jimp,
  dims: number[] = DEFAULT_DIMS!
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

interface ModelOptions {
  verbose?: boolean;
  inferenceSessionOptions?: InferenceSession.SessionOptions;
  dims?: number[];
}

export class Model {
  private session: InferenceSession;

  constructor(
    private readonly opts: ModelOptions,
    private sessionCount: number = 0,
    private confidenceThresh: number = 0.3
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

  submitInference = async (
    image: Jimp
  ): Promise<{ output: number[]; prediction: string | null }> => {
    const [inferenceResult, inferenceTime] = await this.inferenceModel(image);
    const [output, prediction] = inferenceResult;

    return { output, prediction };
  };

  inferenceModel = async (image: Jimp): Promise<[any, number]> => {
    const data = imageDataToTensor(image);
    const [predictions, inferenceTime] = await this.runModel(data);
    return [predictions, inferenceTime];
  };

  runModel = async (preprocessedData: any): Promise<[any, number]> => {
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

    let output = outputData[session.outputNames[0]];
    const results = this.decodeAndPredict(output);

    return [results, inferenceTime];
  };

  maxLoc = (scores: Float32Array): number => {
    let maxIdx = 0;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > scores[maxIdx]) {
        maxIdx = i;
      }
    }
    return maxIdx;
  };

  decode = (
    data: Float32Array,
    dims: readonly number[]
  ): Array<Array<number>> => {
    let result: Array<Array<number>> = [];
    for (let i = 0; i < dims[1]; i++) {
      const row = data.slice(dims[2] * i, (i + 1) * dims[2]);
      result.push([...row]);
    }

    result = result[0].map((_: any, colIndex: any) =>
      result.map((row) => row[colIndex])
    );

    return result;
  };

  decodeAndPredict = (results: Tensor) => {
    const flat: Float32Array = Float32Array.prototype.slice.call(results.data);
    const data = this.decode(flat, results.dims);

    const scores: number[] = [];
    const predictions = data.filter((val: number[]) => {
      const maxScore = Math.max(...val.slice(4));
      return maxScore >= this.confidenceThresh ? scores.push(maxScore) : false;
    });

    if (predictions.length === 0) {
      return [[], null];
    }

    const classIds: { index: number; score: number }[] = predictions.map(
      (val: number[], index: number) => {
        return {
          index: val.findIndex((val) => val === scores[index]) - 4,
          score: scores[index],
        };
      }
    );

    let best: number = -1;
    classIds.reduce((prev: any, { index: curr, score }: any) => {
      if (curr in prev) {
        prev[curr] += 1;
      } else {
        prev[curr] = 1;
      }
      if (this.opts.verbose) {
        console.log("Guess: ", classList[curr]);
        console.log("Score: ", score);
      }
      if (prev[best] < prev[curr] || best === -1) best = curr;
      return prev;
    }, {});

    return [predictions, classList[best]];
  };
}
