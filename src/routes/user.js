import { route } from "./";

import { generateToken } from "../lib/token";
import UserModel from "../db/UserModel";
import { ApplicationError } from "../lib/errors";
import { hashPassword } from "../lib/crypto";
import { ERROR_CODE_INCOMPLETE_DETAILS } from "../lib/errorCode";

export const create = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    const userInformation = req.body;
    const user = await userModel.create(userInformation);
    let { userId } = user;
    let newUserWithAuthToken = Object.assign({}, user, {
      token: await generateToken(userId)
    });
    res.send({ results: newUserWithAuthToken });
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});
export const login = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    const userInformation = req.body;
    if (
      !userInformation ||
      !userInformation.username ||
      !userInformation.password
    ) {
      throw {
        errorCode: ERROR_CODE_INCOMPLETE_DETAILS,
        message: "Details are incomplete",
        statusCode: 401
      };
    }
    const user = await userModel.login(userInformation);
    let { userId } = user;
    let newUserWithAuthToken = Object.assign(
      {},
      {
        token: await generateToken(userId),
        userId
      }
    );
    res.send({ results: newUserWithAuthToken });
  } catch (error) {
    throw new ApplicationError(error, error.statusCode);
  }
});

export const get = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    const users = await userModel.get();
    res.send({ results: users });
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});

export const getById = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    let userId = req.params.Id;
    const user = await userModel.getById(userId);
    res.send({ results: user });
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});
export const put = route(async (req, res) => {
  const userModel = new UserModel();
  try {
    let userId = req.params.Id;
    let userInformation = req.body;
    const user = await userModel.put(userId, userInformation);
    res.send({ results: user });
  } catch (error) {
    throw new ApplicationError(error, 500, {});
  }
});
