import fs from 'fs';
import path from 'path';
import { faceapi, canvas } from '../utilis/faceApiSetup.js';

export async function compareWithAllUploadedImages(base64Image) {
  const buffer = Buffer.from(base64Image, 'base64');
  const capturedImage = await canvas.loadImage(buffer);

  const capturedDetection = await faceapi
    .detectSingleFace(capturedImage)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!capturedDetection) {
    return { match: false, message: 'No face detected in captured image' };
  }

  const capturedDescriptor = capturedDetection.descriptor;

  const uploadsDir = path.resolve('uploads');
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const uploadedImage = await canvas.loadImage(filePath);

    const uploadedDetection = await faceapi
      .detectSingleFace(uploadedImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!uploadedDetection) {
      continue; 
    }

    const distance = faceapi.euclideanDistance(
      capturedDescriptor,
      uploadedDetection.descriptor
    );

    if (distance < 0.6) {
      return {
        match: true,
        message: `Face matched with ${file}`,
        matchedFile: file,
      };
    }
  }

  return { match: false, message: 'No matching face found' };
}
