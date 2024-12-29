import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const dashboardService = {
  getDashboardData: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/dashboard/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
