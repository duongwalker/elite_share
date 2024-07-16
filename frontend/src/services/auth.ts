import axios from "axios"

const baseUrl = 'http://localhost:3001'

type Credentials = {
    email: string
    password: string
}

export const logIn = async (credentials: Credentials) => {
    const user = await axios.post(`${baseUrl}/api/login`, credentials)
    console.log(user.data)
    return user.data
}