import { Multer } from "multer";
import * as tf from "@tensorflow/tfjs-node"
import axios from "axios";
import { inputImage } from "../../types/inputImage.type"
import HttpException from "../../model/http-exception.model"
import prisma from "../../plugins/prisma/prisma.service";
import { Storage } from "@google-cloud/storage";
import { Scan } from "@prisma/client";

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
    const diseaseResult = handleDiseasePrediction(diseases, result.fruit)
    result = {
      ...result,
      disease: diseaseResult.disease,
      desc: diseaseResult.description
    }
  } catch (error: any) {
    throw new HttpException(error.response.status, error.response.statusText)
  }

  const publicUrl = await uploadImage(userId, image)
  
  const resultObj = await prisma.scan.create({
    data: {
      ...result,
      imageUrl: publicUrl,
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

const handleDiseasePrediction = (predictions: number[], fruit: string) => {
  const CLASSIFICATION = [
    "Blotch", "Rot", "Scab", 
    "Anthracnose", "Black Mould Rot", "Stem end Rot",
    "Blackspot", "Canker"
  ];

  const FRUIT_INDEX = {
    "Apple": 0,
    "Mango": 1,
    "Orange": 2
  }

  const DESCRIPTION = [
    "Fungal disease that results in unsightly dark spots on apple leaves and fruits, potentially leading to defoliation and reduced fruit quality.",
    "Condition where apple fruits develop soft, decayed areas, which can spread rapidly, especially in moist conditions, making the fruit inedible.",
    "Common apple disease characterized by dark, scabby lesions on leaves and fruits, leading to blemishes and deformities that affect the apple's appearance and marketability.",
    "Prevalent fungal disease in mangoes, causing dark lesions on various parts of the plant, significantly impacting fruit quality and yield.",
    "Disease that manifests as a black, powdery mold on mango fruits, which can result in internal decay and reduced fruit quality.",
    "Post-harvest disease that affects the stem end of mango fruits, leading to dark lesions and fruit rot, impacting storage and marketability.",
    "Fungal disease causing hard, dark spots on the rind of oranges, which affects the fruit's appearance and can lead to market rejection.",
    "Bacterial disease that causes raised, corky lesions on various parts of the orange tree, leading to defoliation, fruit drop, and reduced tree health and productivity."
  ]
  
  let value = predictions[0]
  let index = 0;
  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i] > value) {
      value = predictions[i]
      index = i
    }
  }

  let disease: string
  let description: string | null

  // set threshold into 80%
  if (value * 100 > 90) {
    // match the disease with the fruit
    if (Math.floor(index/3) == FRUIT_INDEX[fruit]) {
      disease = CLASSIFICATION[index]
      description = DESCRIPTION[index]
      
      return {
        disease,
        description
      }
    }
  }
  return {
    disease: "No disease found",
    description: null
  }
}

const uploadImage = async (userId: string, image: Express.Multer.File): Promise<string> => {
  const storage = new Storage()
  const bucket = storage.bucket("freshgrade-scan-result")
  
  const newFileName = `${Date.now()}-${image.originalname}`
  const storagePath = `${userId}/${newFileName}`

  const blob = bucket.file(storagePath)
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: image.mimetype,
  })

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      reject(new HttpException(500, err.message))
    })

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`
      resolve(publicUrl)
    })

    blobStream.end(image.buffer)
  })
}

export const getUserHistory = async (userId: string): Promise<Scan[]> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new HttpException(404, "User not found")
  }

  const history = await prisma.scan.findMany({
    where: {
      createdBy: user
    }
  })

  return history
}

