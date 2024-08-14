import axios from "axios"

const baseUrl = "http://localhost:3001"

interface Group {
  group_id: number
  group_name: string
}

export const getToken = () => {
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

export async function createGroup(group_name: string, user_id: number) {
  try {
    const newGroup = {
      group_name: group_name,
      created_by: user_id,
    }
    const response = await axios.post(
      `${baseUrl}/groups`,
      newGroup,
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}

export async function deleteGroup(group_id: number) {
  try {
    const response = await axios.delete(
      `${baseUrl}/groups/${group_id}`,
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}

export async function updateGroupName(newGroupInfo: Group) {
  try {
    const response = await axios.put(
      `${baseUrl}/groups/${newGroupInfo.group_id}`,
      newGroupInfo,
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw error
  }
}

export async function createGroupExpense(group_id: number) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(`${baseUrl}/groups/${group_id}`)
    return response
  }
  catch (error) {
    throw error
  }
}
