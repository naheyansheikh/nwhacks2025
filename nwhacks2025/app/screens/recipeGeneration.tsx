import React, { useState } from "react";
import { Text, View, StyleSheet, Button, TextInput } from "react-native";
import axios from 'axios';

const GEMINI_API_KEY = "CHANGE"; // Replace with your actual API key

export default function RecipeGeneratorScreen() {
  const [groceries, setGroceries] = useState<string>('');
  const [recipe, setRecipe] = useState<string>('');

  const generateRecipe = async () => {
    const prompt = `Create a recipe using the following ingredients: ${groceries} only list ingredients and steps and keep in concise`;
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
      const generatedRecipe = response.data["candidates"][0]["content"]["parts"][0]["text"];
      setRecipe(generatedRecipe); // Set the generated recipe
    } catch (error) {
      console.error('Error generating recipe:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter groceries (comma separated)"
        value={groceries}
        onChangeText={setGroceries}
      />
      <Button title="Generate Recipe" onPress={generateRecipe} />
      <Text style={styles.recipeTitle}>Generated Recipe:</Text>
      <Text style={styles.recipe}>{recipe}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B0C4DE",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#D9E6F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  recipeTitle: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  recipe: {
    marginTop: 10,
  },
});