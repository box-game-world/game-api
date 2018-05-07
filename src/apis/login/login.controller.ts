
import express from 'express'
import Users from '../../database/rdb/models/users';
import RDBManager from '../../database/rdb/rdb-manager';
import * as jwt from 'jsonwebtoken'
import redisClient from '../../database/redis/redis';



const getModel = ():Users=>RDBManager.getInstance().getModel( 'users' ) as Users;

export default {

  async login( req:express.Request, res:express.Response ):Promise<any>{ 
    const model:Users = getModel();
    const body = req.body;
    const email:string = body.email;
    const password:string = body.password;
    
    const user = await model.getUserByEmail( email );
    
    if( !user ){
      res.status( 401 ).send( { message:`등록되지 않은 이메일입니다.` });
      return;  
    }

    const result = user.dataValues;
    const registedPassword:string = result.password;
    const registedSalt:string = result.salt;
    if( registedPassword !== Users.generatePassword( password, registedSalt ) ){
      res.status( 401 ).send( { message:'비밀번호를 확인해주세요.' });
      return;  
    }
    const token = await jwt.sign( { email:result.email, nickname:result.nickname}, 'test_scret_key' );
    
    redisClient.hset( 'box-game-token-hash', token, JSON.stringify( { email:result.email, nickname:result.nickname } ) );
    res.status( 200 ).send( { message:`Hello ${result.name}`, token:token })
  },

  async logout( req:express.Request, res:express.Response ):Promise<any>{
    const token:string  = req.headers[ 'bgw-access-token' ] as string;
    const user:string = await redisClient.hget( 'box-game-token-hash',  token );
    console.log( user );
    await redisClient.hdel( 'box-game-token-hash', token );
    res.status( 200 ).send( { message:`Bye ${ JSON.parse( user ).nickname }` })
  }
}
