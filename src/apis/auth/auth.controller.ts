
import express from 'express'
import redisClient from '../../database/redis/redis';

export default {

  async validationToken( req:express.Request, res:express.Response ):Promise<any>{ 
    const result:boolean = await redisClient.hexists( 'box-game-token-hash', req.param( 'token' ) );
    res.status( 200 ).send( { valid:result })
  }
}
