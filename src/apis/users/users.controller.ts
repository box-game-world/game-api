
import express from 'express'
import Users from '../../database/rdb/models/users';
import RDBManager from '../../database/rdb/rdb-manager';
import redisClient from '../../database/redis/redis';

const getModel = ():Users=>RDBManager.getInstance().getModel( 'users' ) as Users;

export default {

  async createUser( req:express.Request, res:express.Response ):Promise<any>{ 
    const model:Users = getModel();
    const body = req.body;
    const email:string = body.email;
    const nickname:string = body.nickname;
    
    if( await model.hasUser( email ) ){
      res.status( 400 ).send( { message:`이미 등록된 이메일 입니다.` });
      return;
    }
    if( await model.hasNickname( nickname ) ){
      res.status( 400 ).send( { message:`이미 등록된 닉네임 입니다.` });
      return;
    } 

    await model.createUser( req.body );
    res.status( 200 ).send( { message:`Hello ${ req.body.nickname}` })
  },

  async updateUserNickname( req:express.Request, res:express.Response ):Promise<any>{
    const model:Users = getModel();
    const body = req.body;
    const email:string = body.email;
    const nickname:string = body.nickname;

    if( !await model.hasUser( email ) ){
      res.status( 400 ).send( { message:`이메일 정보가 유효하지 않습니다. 이메일 정보를 확인해주세요.` })
      return;
    }

    if( await model.hasNickname( nickname ) ){
      res.status( 400 ).send( { message:`이미 등록된 닉네임 입니다.` })
      return;
    }
    await model.updateUserNickname( { email, nickname } );
    res.status( 200 ).send( { message:`Hello ${ nickname }` })
  },

  async deleteUser( req:express.Request, res:express.Response ):Promise<any>{
    const model:Users = getModel();
    const body = req.body;
    const email:string = body.email;

    if( !await model.hasUser( email ) ){
      res.status( 400 ).send( { message:`이메일 정보가 유효하지 않습니다. 이메일 정보를 확인해주세요.` })
      return;
    }

    await model.updateUserStatus( { email, status:'disabled' } );
    res.status( 200 ).send( { message:'OK' })
  },

  async getUserByToken( req:express.Request, res:express.Response ):Promise<any>{
    const token:string = req.params.token;
    const user:string = await redisClient.hget( 'box-game-token-hash',  token );
    res.status( 200 ).send( JSON.parse( user ) );
  }

  
}
