import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, TextInput } from "react-native";
import axios from 'axios';
import { supabase } from "@/services/supabaseClient";
import { GEMINI_API_KEY } from "../env";

export default function RecipeGeneratorScreen() {
  const [groceries, setGroceries] = useState<string>('');
  const [recipe, setRecipe] = useState<string>('');

  useEffect(() => {
    const fetchGroceries = async () => {
      const { data } = await supabase
        .from('groceries')
        .select("*");
      setGroceries(data.map(d => d.name));
    };

    fetchGroceries();
  }, []);

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
    backgroundColor: "#B0C4DE", // Match the pastel blue background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#A2B9CE", // Slightly darker pastel blue for borders
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#D9E6F2", // Lighter pastel blue for input field
    color: "black", // Black input text
  },
  button: {
    backgroundColor: "#6D8299", // Soft gray for the button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40, // Add more space below the button
  },
  buttonText: {
    color: "white", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 40, // Add space above the recipe title
  },
  recipe: {
    fontSize: 16,
    color: "black", // Black text for recipe details
    lineHeight: 24,
    backgroundColor: "#D9E6F2", // Match input field color
    padding: 10,
    borderRadius: 8,
  },
});
