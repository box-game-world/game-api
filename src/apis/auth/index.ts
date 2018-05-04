import * as express from 'express';
import controller from './auth.controller'

const router:express.Router = express.Router();
router.get( '/validation-token', controller.validationToken );
export default router;