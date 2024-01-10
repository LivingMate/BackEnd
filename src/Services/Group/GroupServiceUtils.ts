import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { SignupDto } from '../../DTOs/Auth/Requests/SignupDto'
import { GroupResponseDto } from '../../DTOs/Group/Responses/GroupResponseDto'
import * as UserService from '../UserService'
import { group } from 'console'

// groupId로 group찾기
const findGroupById = async (groupId: string) => {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  })
  if (!group) {
    throw new Error('No group found with the given groupId')
  }
  return group
}

// 유효한 그룹인지 확인
const checkForbiddenGroup = async (userGroupId: string, groupId: string) => {
  if (userGroupId !== groupId) {
    throw new Error('Forbidden Group')
  }
}

// join된 그룹인지 확인하기
const checkJoinedGroupId = async (groupId: string) => {
  try {
    const existingGroup = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    })

    if (!existingGroup) {
      throw new Error('Joined Group')
    }
  } catch (error) {
    throw error
  }
}

const findGroupNameByGroupId = async (groupId: string) => {
    const groupName = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        groupName: true,
      },
    })
    if (!groupName) {
      throw new Error('groupName not found!')
    }
  
    return groupName
  }
  
  const findGroupMembersNamesColorsByGroupId = async (groupId: string) => {
    const groupMembers = await prisma.user.findMany({
      where: { groupId: groupId },
      select: {
        userName: true,
        userColor:true
      },
    })
  
    return groupMembers;
  }
  
  //return groupMembers 하면 나오는 모양:
  // [
  //     {
  //         userName: 'User 1',
  //         userColor: 'Color 1'
  //     },
  //     {
  //         userName: 'User 2',
  //         userColor: 'Color 2'
  //     },
  //     // ...other user objects
  // ]
  
  const findGroupMembersColorsByGroupId = async (groupId: string) => {
    const groupMembers = await prisma.user.findMany({
      where: { groupId: groupId },
      select: {
        userColor: true,
      },
    })
    return groupMembers.map((member) => member.userColor) //컬러만 묶어서 array로 반환하는 버전
  }
  
  //멤버 이름과 컬러를 따로 받는 방법의 문제점: 순서가 그대로일지.. 모름... 색이 서로 바뀔 수도 있음.


  export {
    findGroupById,
    checkForbiddenGroup,
    checkJoinedGroupId,
    findGroupNameByGroupId,
    findGroupMembersNamesColorsByGroupId,
    findGroupMembersColorsByGroupId,
  }