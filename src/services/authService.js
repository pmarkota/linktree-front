import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const checkPhoneAvailability = async (phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/check-phone`, {
      phone_number: phoneNumber,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking phone availability:", error);
    return {
      success: false,
      message: "Failed to check phone availability",
    };
  }
};

export const authService = {
  requestOTP: async (phoneNumber) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/request-otp`, {
        phone_number: phoneNumber,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyOTP: async (phoneNumber, otpCode) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        phone_number: phoneNumber,
        otpCode,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  checkSubdomain: async (subdomain) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/check-subdomain`, {
        subdomain,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  validateToken: async (token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/validate-token`,
        {},
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

  checkPhoneAvailability,
};
