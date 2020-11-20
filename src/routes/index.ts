import * as express from 'express';
import loginRouter from './auth/Login';

const router: express.Router = express();

router.use('/oauth', loginRouter);

router.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello typescript express!');
});

export default router;
