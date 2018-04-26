import * as express from 'express';
import controller from './users.controller'

const router:express.Router = express.Router();

router.post( '/', controller.createUser );
router.put( '/', controller.updateUserNickname );
router.delete( '/', controller.deleteUser );


export default router;