import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';

const instance = axios.create({
    baseURL: BASE_URL
});

export const getRestaurants = (current = 1, pageSize = 10) => {
    return instance.get('api/v1/restaurants', {
        params: {
            current,
            pageSize
        }
    }).then(res => res.data);
}; 