import BaseModel from "./BaseModel";
import { hashPassword, comparePassword } from "../lib/crypto";
import { default as userSchema } from "../schemas/user.schema.js";

import {
  ERROR_CODE_USER_CREATE,
  ERROR_CODE_USER_DOSE_NOT_EXIST,
  ERROR_CODE_INCORRECT_PASSWORD,
  ERROR_CODE_USER_GET
} from "../lib/errorCode";

export default class userModel extends BaseModel {
  constructor(connection) {
    super("User", connection);
    this.schema = userSchema;
    this.name = "User";
    this.model = this.connection.model(this.name, this.schema);
  }
  async create(userInformation) {
    try {
      const encryptedPassword = await hashPassword(userInformation.password);
      Object.assign(userInformation, { password: encryptedPassword });
      const user = await this.model.create(userInformation);
      if (!user) {
        throw {
          errorCode: ERROR_CODE_USER_CREATE,
          message: "Error while creating user"
        };
      }
      return user._doc;
    } catch (error) {
      throw error;
    }
  }
  async login(userInformation) {
    try {
      const user = await this.model.findOne({
        email: userInformation.email
      });

      if (!user) {
        throw {
          message: "No User Is registered with this Username",
          errorCode: ERROR_CODE_USER_DOSE_NOT_EXIST,
          statusCode: 401
        };
      }
      const confirmUserPassword = await comparePassword(
        userInformation.password,
        user.password
      );
      if (!confirmUserPassword) {
        throw {
          errorCode: ERROR_CODE_INCORRECT_PASSWORD,
          message: "Password incorrect",
          statusCode: 401
        };
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getById(userId) {
    try {
      const user = await this.model
        .findOne(
          {
            userId: userId,
            statusFlag: true
          },
          { password: 0 }
        )
        .populate({
          path: "coldStorage",
          model: "ColdStorage"
        })
        .lean();
      if (!user) {
        throw {
          message: "Error while fetching user detail",
          errorCode: ERROR_CODE_USER_GET,
          statusCode: 502
        };
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async put(userId, userInformation) {
    try {
      const user = await this.model.findOneAndUpdate(
        { userId: userId, statusFlag: true },
        { $set: userInformation },
        { new: true }
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
}
