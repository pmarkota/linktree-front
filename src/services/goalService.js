import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const goalService = {
  updateGoal: async (goalType, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/profile/goal`,
        { goalType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
