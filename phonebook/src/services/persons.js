import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
    console.log('GetAll Test')
}

const create = (personObject) => {
    const request = axios.post(baseUrl, personObject)
    return request.then((response) => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const change = (id, personObject) => {
    const request = axios.put(`${baseUrl}/${id}`, personObject)
    return request.then((response) => response.data)
}

export default {
    getAll,
    create,
    remove,
    change
}