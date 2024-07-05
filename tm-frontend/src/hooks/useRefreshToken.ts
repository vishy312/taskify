import axios from "../api/axios"
import useTmAuth from "../context/AuthProvider"

const REFRESH_TOKEN_ENDPOINT = "/users/refresh-token"

function useRefreshToken() {
  const {setAuth}: any = useTmAuth()

  const refresh = async () => {
    const response = await axios.post(REFRESH_TOKEN_ENDPOINT, {}, {
      withCredentials: true
    })
    console.log(response)

    setAuth((prev: any) => {
      return {
        ...prev,
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
      }
    });
    return response.data.data.accessToken
  }
  return refresh
}

export default useRefreshToken