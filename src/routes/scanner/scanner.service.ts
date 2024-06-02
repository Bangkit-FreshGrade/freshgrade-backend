import { Multer } from "multer";
import * as tf from "@tensorflow/tfjs-node"
import axios from "axios";
import { inputImage } from "../../types/inputImage.type";
import HttpException from "../../model/http-exception.model"


export const postPredict = async (image: Express.Multer.File) => {
  
  const tensor = tf.node
    .decodeImage(image.buffer, 3)
    .resizeNearestNeighbor([244,244])
    .expandDims()
    .toFloat()

  const request: inputImage = {
    array: tensor.arraySync() as number[][]
  }

  const base_url = process.env.ML_BASE_URL
  if (!base_url) {
    throw new HttpException(500, "Machine learning endpoint is not defined")
  }

  // TODO: predict fruit freshness

  // predict fruit disease
  const response = await axios.post(base_url + "/predict/disease", request)

  if (response.status !== 200) {
    throw new HttpException(response.status, response.data.detail)
  }

  const prediction: number[] = response.data.predictions

  const CLASSIFICATION = ["Blotch", "Rot", "Scab", 
                          "Alternaria", "Anthracnose", "Black Mould Rot", "Stem end Rot",
                          "Blackspot", "Canker", "Grenning"
                        ];
  
  let value = prediction[0]
  let index = 0;
  for (let i = 1; i < prediction.length; i++) {
    if (prediction[i] > value) {
      value = prediction[i]
      index = i
    }
  }
  
  const result = CLASSIFICATION[index]

  // TODO: handle the disease result
}