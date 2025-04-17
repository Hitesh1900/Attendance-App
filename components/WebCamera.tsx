// components/WebcamCapture.tsx
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from 'react-native';
import { View, Image, StyleSheet, Text } from 'react-native';

type Props = {
  onCapture: (imageSrc: string) => void;
};

const WebcamCapture: React.FC<Props> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      onCapture(imageSrc);
    }
  };

  return (
    <View style={styles.container}>
      {!image ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user',
          }}
          style={styles.webcam}
        />
      ) : (
        <Image source={{ uri: image }} style={styles.preview} />
      )}

      <Button title={image ? 'Retake' : 'Capture'} onPress={() => (image ? setImage(null) : capture())} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  webcam: {
    width: 320,
    height: 240,
  },
  preview: {
    width: 320,
    height: 240,
    marginBottom: 10,
  },
});

export default WebcamCapture;
