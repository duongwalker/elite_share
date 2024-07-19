import axios from "axios"

const baseUrl = "http://localhost:3001"

export const getToken = () => {
  // const user = JSON.parse(localStorage.getItem('loggedUser') || 'null')
  // if(user!=='null') {
  //     const token = user ? user.accessToken : null;
  //     return token
  // }
  // else {
  //     return null
  // }

  const user = window.localStorage.getItem("loggedUser")
  const parsedUser = user ? JSON.parse(user) : null
  return parsedUser ? parsedUser.accessToken : null
}

const getConfig = () => {
  const token = getToken()
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  }
}

export async function getGroupsByUserId(id: number) {
  try {
    const response = await axios.get(
      `${baseUrl}/user-groups/${id}`,
      getConfig()
    )

    return response.data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}

export async function getExpensesByGroupId(id: number) {
  try {
    const response = await axios.get(
      `${baseUrl}/groups/${id}/expenses`,
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}


export async function addGroup() {
  try {
    const response = await axios.get(
      `${baseUrl}/groups/${id}/expenses`,
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}