import HttpException from "../../model/http-exception.model"
import prisma from "../../plugins/prisma/prisma.service";
import { LoginDTO, RegisterDTO } from "../../dto/user.dto";
import { Tokens } from "../../types/tokens.type";
import * as argon from "argon2";
import generateToken from "./token.utils";
import { User } from "@prisma/client";
import { UserResponse } from "../../types/userResponse.type";
import { ChangePasswordDto } from "../../dto/change-password.dto";

const checkUnique = async (dto: RegisterDTO) => {
  if (!dto.email || !dto.firstName || !dto.password || !dto.username || !dto.lastName) {
    throw new HttpException(400, "Missing properties");
    
  }

  const checkEmail = await prisma.user.findUnique({
    where: {
      email: dto.email
    }
  })

  if (checkEmail) {
    throw new HttpException(409, "Email has already been taken")
  }

  const checkUsername = await prisma.user.findUnique({
    where: {
      username: dto.username
    }
  })

  if (checkUsername) {
    throw new HttpException(409, "Username has already been taken")
  }

  await validatePassword(dto.username, dto.password)
}

const validatePassword = async (username: string, password: string) => {
  if (password.length < 6) {
    throw new HttpException(422, "Password length must be at least 6 characters")
  }

  if (password === username) {
    throw new HttpException(422, "Password cannot be the same as username")
  }
}

export const createUser = async (dto: RegisterDTO): Promise<Tokens> => {
  await checkUnique(dto);

  const hash = await argon.hash(dto.password);

  const user = await prisma.user
    .create({
      data: {
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash: hash
      }
    })
    .catch((error: any) => {
      throw new HttpException(500, {
        errors: error
      })
    })

  const tokens = generateToken(
    user.id,
    user.email,
    user.username,
    user.firstName,
    user.lastName
  )

  return tokens;
  
}

export const getUser = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })

  return user;
}

export const login = async (dto: LoginDTO): Promise<Tokens> => {
  if (!dto.email && !dto.username) {
    throw new HttpException(400, "Email or username cannot be empty")
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: dto.email
        },
        {
          username: dto.username
        }
      ]
    }
  });

  if (!user) {
    throw new HttpException(403, "Email or username is not found")
  }

  const passwordMatches = await argon.verify(user.hash, dto.password);

  if (!passwordMatches) {
    throw new HttpException(403, "Password is invalid")
  }

  const tokens = generateToken(
    user.id,
    user.email,
    user.username,
    user.firstName,
    user.lastName
  );

  return tokens;
}

export const getUserDetails = async (id: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      email: true,
      hash: false,
      username: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!user) {
    throw new HttpException(404, "User not found")
  }

  return user
}

export const changePassword = async (userId: string, dto: ChangePasswordDto): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new HttpException(404, "User not found")
  }
  
  const currentPassword = await argon.verify(user.hash, dto.currentPassword)
  if (!currentPassword) {
    
    throw new HttpException(401, "Current password is incorrect")
  }
  
  if (dto.newPassword === dto.currentPassword) {
    throw new HttpException(400, "New password must be different from the current password")
  }
    
  
  if (dto.newPassword !== dto.confirmNewPassword) {
    throw new HttpException(400, "Confirm password is different from your new password")
  }

  await validatePassword(user.username, dto.newPassword)

  const newHash = await argon.hash(dto.newPassword)

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      hash: newHash
    },
  })
}