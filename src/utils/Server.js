import axios from "axios";


const Server = axios.create({
    // baseURL : 'http://localhost:5000/api/v1'
    baseURL : `${import.meta.env.VITE_API_URL}/api/v1`
})

export default Server