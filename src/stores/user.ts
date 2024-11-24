import { loginApi } from '@/api/auth'
import { fetchUserInfoApi } from '@/api/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 用户详情
  const userDetail = ref<UserDetailResponseType | null>({
    operatorName: '',
    userId: 0,
    userRoleIds: [],
    userType: 0,
    userProfileId: 0,
    username: '',
    firstName: '',
    lastName: '',
    gender: 0,
    telephone: '',
    post: '',
    authorities: [
      {
        authority: '',
      },
    ],
  })

  // 登录
  const login = async ({ username, password, captchaKey, captchaValue }: LoginRequestType) => {
    const { data } = await loginApi({ username, password, captchaKey, captchaValue }).catch(error => {
      throw error
    })
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('tokenExpiration', data.accessTokenExpiration)
    userDetail.value = data.userDetail
    return data
  }

  const getUserInfo = async () => {
    const { data } = await fetchUserInfoApi().catch(error => {
      throw error
    })
    userDetail.value = data
    return data
  }

  const setUserDetail = (value: UserDetailResponseType) => {
    userDetail.value = value
  }

  const resetUser = () => {
    userDetail.value = {
      operatorName: '',
      userId: 0,
      userRoleIds: [],
      userType: 0,
      userProfileId: 0,
      username: '',
      firstName: '',
      lastName: '',
      gender: 0,
      telephone: '',
      post: '',
      authorities: [
        {
          authority: '',
        },
      ],
    }
  }

  return {
    userDetail,
    setUserDetail,
    login,
    resetUser,
    getUserInfo,
  }
})
