import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}

const create = (personObject) => {
    const request = axios.post(baseUrl, personObject)
    return request
        .then((response) => response.data)
        .catch(error => {
            const errorMessage = error.response?.data?.error || error.message
            throw new Error(errorMessage)
        })
}

const remove = (id) => {
    return axios
        .delete(`${baseUrl}/${id}`)
        .catch(error => {
            const errorMessage = error.message
            throw new Error(errorMessage)
        })
}

const change = (id, personObject) => {
    const request = axios.put(`${baseUrl}/${id}`, personObject)
    return request
        .then((response) => response.data)
        .catch(error => {
            const errorMessage = error.message
            throw new Error(errorMessage)
        })
}

export default {
    getAll,
    create,
    remove,
    change
}