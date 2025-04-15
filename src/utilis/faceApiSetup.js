import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_PATH = path.join(__dirname, '..', 'model');

export async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
}

export { faceapi, canvas };
