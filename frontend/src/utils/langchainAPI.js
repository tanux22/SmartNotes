import axios from 'axios';

export async function fetchAIResponse(prompt) {
  try {
    const response = await axios.post('http://localhost:8000/generate', {
      prompt: prompt,
    });
    return response.data.response;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    throw error;
  }
}