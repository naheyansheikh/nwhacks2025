import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';  // Import Image Picker
import Tesseract from 'tesseract.js';  // Import Tesseract.js for OCR

export default function FoodItemInput() {
  const [imageUri, setImageUri] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri ?? '';
          setImageUri(uri); 
          extractTextFromImage(uri); 
        }
      }
    );
  };

  const extractTextFromImage = (imagePath: string) => {
    Tesseract.recognize(
      imagePath, 
      'eng',
      {
        logger: (m) => console.log(m),
      }
    )
      .then((result) => {
        const text = result.data.text;
        console.log('Extracted Text: ', text);
        setExtractedText(text);  
      })
      .catch((err) => {
        console.error('OCR Error: ', err);
        setExtractedText('Failed to extract text');
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Select Receipt" onPress={handleImagePick} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {extractedText ? (
        <View style={styles.textContainer}>
          <Text style={styles.extractedText}>Extracted Text: </Text>
          <Text>{extractedText}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  textContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  extractedText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
