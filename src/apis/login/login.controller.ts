
import express from 'express'
import Users from '../../database/rdb/models/users';
import RDBManager from '../../database/rdb/rdb-manager';
import { randomBytes } from 'crypto';

const getModel = ():Users=>RDBManager.getInstance().getModel( 'users' ) as Users;

export default {

  async login( req:express.Request, res:express.Response ):Promise<any>{ 
    const model:Users = getModel();
    const body = req.body;
    const email:string = body.email;
    const password:string = body.password;
    
    const user = await model.getUserByEmail( email );
    
    if( !user ){
      res.status( 404 ).send( { message:`등록되지 않은 이메일입니다.` });
      return;  
    }

    const result = user.dataValues;
    const registedPassword:string = result.password;
    const registedSalt:string = result.salt;
    if( registedPassword !== Users.generatePassword( password, registedSalt ) ){
      res.status( 404 ).send( { message:'비밀번호를 확인해주세요.' });
      return;  
    }

    res.status( 200 ).send( { message:`Hello`, token:randomBytes(64).toString( 'hex' ) })
  },

  async logout( req:express.Request, res:express.Response ):Promise<any>{
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
  }
}
