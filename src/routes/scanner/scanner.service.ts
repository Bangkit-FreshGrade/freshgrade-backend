import { Multer } from "multer";
import * as tf from "@tensorflow/tfjs-node"
import axios from "axios";
import { inputImage } from "../../types/inputImage.type"
import HttpException from "../../model/http-exception.model"
import prisma from "../../plugins/prisma/prisma.service";

export const postPredict = async (userId: string, image: Express.Multer.File) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new HttpException(404, "User not found")
  }
  
  const tensor = tf.node
    .decodeImage(image.buffer, 3)
    .resizeNearestNeighbor([224,224])
    .expandDims()
    .toFloat()
    .div(tf.scalar(255.0)) // normalize

  const request: inputImage = {
    array: tensor.arraySync() as number[][]
  }

  const base_url = process.env.ML_BASE_URL
  if (!base_url) {
    throw new HttpException(500, "Machine learning endpoint is not defined")
  }

  let result: any
  try {
    const freshnessResponse = await axios.post(`${base_url}/predict/condition`, request)
    const freshness: number[] = freshnessResponse.data.predictions[0]
    const freshnessResult = handleFreshCondition(freshness)
    result = {
      ...freshnessResult
    }
  } catch (error: any) {
    throw new HttpException(error.response.status, error.response.statusText)
  }

  try {
    const diseaseResponse = await axios.post(`${base_url}/predict/disease`, request)
    const diseases: number[] = diseaseResponse.data.predictions[0]
    const diseaseResult = handleDiseasePrediction(diseases)
    result = {
      ...result,
      disease: diseaseResult
    }
  } catch (error: any) {
    throw new HttpException(error.response.status, error.response.statusText)
  }

  const resultObj = await prisma.scan.create({
    data: {
      ...result,
      createdBy: {
        connect: {
          id: userId
        }
      }
    },
  })
  .catch((err) => {
    console.error(err)
    throw new HttpException(500, "Error while accessing database")
  })

  return resultObj
}

const handleFreshCondition = (predictions: number[]) => {
  
  let value = predictions[0]
  let index = 0;
  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i] > value) {
      value = predictions[i]
      index = i
    }
  }
  
  let fruit = ""
  if (index == 0) fruit = "Apple"
  else if (index == 1) fruit = "Mango"
  else fruit = "Orange"

  return {
    fruit: fruit,
    value: parseFloat((value * 100).toFixed(2))
  }
}

const handleDiseasePrediction = (predictions: number[]) => {
  const CLASSIFICATION = ["Blotch", "Rot", "Scab", 
                          "Anthracnose", "Black Mould Rot", "Stem end Rot",
                          "Blackspot", "Canker"
                        ];
  
  let value = predictions[0]
  let index = 0;
  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i] > value) {
      value = predictions[i]
      index = i
    }
  }
  
  // set threshold into 80%
  return value * 100 > 80 ? CLASSIFICATION[index] : "No disease found"
}

// TODO: handle upload img to gcs
const uploadImage = async (userId: string, image: Express.Multer.File) => {
  
}