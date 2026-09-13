import api from "./axios";

export const submitContactMessage = async (contactData) => {
  const response = await api.post("/contact", contactData);

  return response.data;
};
