import * as express from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const googleLogin = async (req: express.Request, res: express.Response) => {
  passport.authenticate(
    'google',
    { failureRedirect: process.env.ADMIN_ADDR_LOGIN },
    (err: Error, user: any) => {
      if (err) return false;

      const [email] = user.emails;
      const token = jwt.sign(
        { userEmail: email.value },
        process.env.JWT_SECRET
      );

      if (token) {
        res.cookie('jwt', token, { domain: 'localhost', httpOnly: true });
        return res.redirect(process.env.ADMIN_ADDR_MAIN);
      }

      throw new Error('not found token');
    }
  )(req, res);
};

const githubLogin = async (req: express.Request, res: express.Response) => {
  passport.authenticate(
    'github',
    { failureRedirect: process.env.ADMIN_ADDR_LOGIN },
    (err: Error, user: any) => {
      if (err) return false;

      const [email] = user.emails;
      const token = jwt.sign(
        { userEmail: email.value },
        process.env.JWT_SECRET
      );

      if (token) {
        res.cookie('jwt', token, { domain: 'localhost', httpOnly: true });
        return res.redirect(process.env.ADMIN_ADDR_MAIN);
      }

      throw new Error('not found token');
    }
  )(req, res);
};

const naverLogin = async (req: express.Request, res: express.Response) => {
  passport.authenticate(
    'naver',
    { failureRedirect: process.env.ADMIN_ADDR_LOGIN },
    (err: Error, user: any) => {
      if (err) return false;

      const [email] = user.emails;
      const token = jwt.sign(
        { userEmail: email.value },
        process.env.JWT_SECRET
      );

      if (token) {
        res.cookie('jwt', token, { domain: 'localhost', httpOnly: true });
        return res.redirect(process.env.ADMIN_ADDR_MAIN);
      }

      throw new Error('not found token');
    }
  )(req, res);
};

export default { googleLogin, githubLogin, naverLogin };
