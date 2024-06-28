import axios from "axios"

const baseUrl = 'http://localhost:3001'

export async function getGroupsByUserId(id: number) {
    try {
        const response = await axios.get(`${baseUrl}/user-groups/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function getExpensesByGroupId(id:number) {
    try {
        const response = await axios.get(`${baseUrl}/groups/${id}/expenses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}