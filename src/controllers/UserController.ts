import * as express from 'express';
import { ReqUserDocument, UserDocument } from '../models/User';
import UserService from '../services/UserService';

const getUser = async (req: express.Request, res: express.Response) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.json(err);
  }
};

const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const result: any = await UserService.readUsers();
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

const getProjects = async (req: express.Request, res: express.Response) => {
  try {
    const result: {} = await UserService.readProjects(
      req.user as ReqUserDocument
    );
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

const getUserByEmail = async (req: express.Request, res: express.Response) => {
  try {
    const result: UserDocument[] = await UserService.readUserByEmail(
      req.user as ReqUserDocument,
      req.params.email
    );
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

export default { getUser, getUsers, getProjects, getUserByEmail };
