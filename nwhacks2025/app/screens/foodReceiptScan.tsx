import { supabase } from '@/services/supabaseClient';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { GEMINI_API_KEY } from '../env';
import { Alert } from 'react-native';

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

  const handleImagePick = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // Check if the picker was canceled or an image was selected
    if (!result.canceled) {
      setImageUri(result.assets[0].uri); 
      extractTextFromImage(result.assets[0].uri);
    }
  };
  
  const extractTextFromImage = async (imagePath: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imagePath, { encoding: 'base64' });
  
      const response = await fetch('http://localhost:3000/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image: base64 }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const result = await response.json();
      readGroceriesFromReceipt(result["text"]);
    } catch (error) {
      console.error('Error extracting text from image:', error);
      throw error;
    }
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

      if (groceriesJSON == undefined) {
        Alert.alert("Something went wrong! Please try again.");
      }

      let groceryLog = "";
      const promises = groceriesJSON.map(async (g) => {
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

      Promise.all(promises)
        .then(() => {
          setGroceryLog(groceryLog);
          console.log("LOG : " + groceryLog);
        })
        .catch((error) => {
          console.error('Error unable to read Groceries:', error);
        });
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

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Select Receipt from Photos.." onPress={handleImagePick} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.extractedText}>Detected Groceries:</Text>
        {groceryLog ? <Text>{groceryLog}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '10%', // Adjust padding to position content in the top half
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Add space between buttonContainer and textContainer
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  textContainer: {
    width: '80%', // Adjust width as needed
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20, // Add space between image and textContainer
  },
  extractedText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});