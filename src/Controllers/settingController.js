const apiUrl = "http://localhost:3090/settings";

export const getSettings = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error or handle it appropriately
  }
};

export const updateSettings = async (data) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error or handle it appropriately
  }
};