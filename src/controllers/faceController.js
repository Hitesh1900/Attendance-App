import { compareWithAllUploadedImages } from '../services/faceService.js';

export async function verifyFace(req, res) {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const result = await compareWithAllUploadedImages(base64Data);

    if (result.match) {
      return res.status(200).json({
        status: 'success',
        ...result,
      });
    } else {
      return res.status(404).json({
        status: 'failed',
        ...result,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
