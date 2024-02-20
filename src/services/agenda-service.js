import axios from "axios";

export const fetchData = async (baseUrl) => {

  try {
    const response = await axios.get(baseUrl); 
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
};

export const sendData = async (props) => {
    const {baseUrl, data} = props;

  try {
    const response = await axios.post(baseUrl, data);
    return response.data;
  } catch (error) {
    console.error('Error sending data:', error);
    throw error; 
  }
};

export const patchData = async (props) => {
    const {baseUrl, data} = props;

    try {
        const response = await axios.patch(baseUrl, data);
        return response.data;
    } catch (error) {
        console.log('Error updating data:', error);
        throw error;
    }
}

export const deleteData = async (baseUrl) =>{
    try {
        const response = await axios.delete(baseUrl);
        return response.data
    } catch (error) {
        console.log('Error deleting data:', error);
        throw error;
    }
}