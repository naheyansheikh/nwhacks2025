import { supabase } from '@/services/supabaseClient';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';  // Import Image Picker
import Tesseract from 'tesseract.js';  // Import Tesseract.js for OCR
import { GEMINI_API_KEY } from '../env';

// TODO: make photo selecter compatible with ios simulator
export default function FoodItemInput() {
  const [imageUri, setImageUri] = useState<string>('');
  const [groceryLog, setGroceryLog] = useState<string>('');
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || "");
    };

    fetchUser();
  }, []);

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

  const readGroceriesFromReceipt = async (receiptText: string) => {
    const prompt = `give me a list of all food items in ${receiptText} in raw JSON format with no \`\`\` surrounding it, with each with fields name, 
      expiration_date.  expiration_date should be a YYYY-MM-DD formatted string that you estimate it would be from today (2025-01-19)`;

    try {
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // formats chatgpt text so that database is happy
      const responseText = response.data["candidates"][0]["content"]["parts"][0]["text"];
      const groceriesJSON = JSON.parse(responseText);

      let groceryLog = "";
      groceriesJSON.forEach(async (g) => {
        g["status"] = calculateStatus(g["expiration_date"]);
        g["user_id"] = userId;

        console.log(g);

        const { error } = await supabase
          .from('groceries')
          .insert(g);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        groceryLog += `Added ${g["name"]} (expires on ${g["expiration_date"]})\n`;
      });
      
      console.log(groceryLog);
      setGroceryLog(groceryLog);
    } catch (error) {
      console.error('Error unable to read Groceries:', error);
    }
  };

  const calculateStatus = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysUntilExpiration = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration < 0) return "expired";
    if (daysUntilExpiration <= 7) return "expiring-soon";
    return "all";
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
        readGroceriesFromReceipt(text);   
      })
      .catch((err) => {
        console.error('OCR Error: ', err);
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Select Receipt" onPress={handleImagePick} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {groceryLog ? (
        <View style={styles.textContainer}>
          <Text style={styles.extractedText}>Added:  </Text>
          <Text>{groceryLog}</Text>
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
