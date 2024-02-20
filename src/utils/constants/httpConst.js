export const apiUrl = process.env.REACT_APP_SPRING_APP_URL;

export const buildUrl = (endpointName) => {
    
    let url = `${apiUrl}${endpointName}`;

    return url;
};