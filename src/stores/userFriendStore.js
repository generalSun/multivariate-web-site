import { defineStore } from 'pinia'
import { getUserFriends } from '@/libs/axios/modules/user'
import { computed, ref } from 'vue'

export const useUserFriendStore = defineStore('userFriendStore', () => {
  const friendList = ref([])
  const hasFriends = computed(() => friendList.value.length)
  const fetchFriendList = async (userId) => {
    if (hasFriends.value) {
      return friendList.value
    }
    try {
      const response = await getUserFriends(userId)
      const { data } = response ?? {}
      friendList.value = data ?? []
      return friendList.value
    } catch (error) {
      console.error('获取好友列表失败:', error)
      return friendList.value
    }
  }
  const addFriend = (friend) => {
    friendList.value.push(friend)
  }
  const removeFriend = (friendId) => {
    friendList.value = friendList.value.filter((friend) => friend.userId !== friendId)
  }
  const updateFriend = (updatedFriend) => {
    const index = friendList.value.findIndex((friend) => friend.userId === updatedFriend.userId)
    if (index !== -1) {
      friendList.value[index] = { ...friendList.value[index], ...updatedFriend }
    }
  }
  const reset = () => {
    friendList.value = []
  }
  return { fetchFriendList, addFriend, removeFriend, updateFriend, reset, friendList }
})
