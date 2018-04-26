


import AbsModel from '../abs-model';
import Sequelize from 'sequelize';
import {pbkdf2Sync} from 'crypto';

const MODEL_NAME:string = 'users_local';

const SCHEMA:any = {
  no:{ 
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  email:{
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },

  password:{
    type: Sequelize.STRING,
    allowNull: false,
  },

  nickname:{
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },

  salt:{
    type: Sequelize.STRING,
    allowNull: false,
  },

  status:{
    type: Sequelize.ENUM( 'enabled', 'disabled' ),
    allowNull: false,
  }
}

export default class Users extends AbsModel{

  protected _getModelName():string{ return MODEL_NAME;}
  protected _getSchema():any{ return SCHEMA; }

  public async getUserByEmail( email:string ):Promise<any>{
    return await this._model.findOne( { where:{ email:email } } );
  }

  public async getUserByName( nickname:string ):Promise<any>{
    return await this._model.findOne( { where:{ nickname:nickname } } );
  }

  public async hasUser( email:string ):Promise<any>{ 
    return !!await this.getUserByEmail( email ); 
  }

  public async hasNickname( nickname:string ):Promise<any>{
    return !!await this.getUserByName( nickname ); 
  }

  public async createUser( user:{ email:string, nickname:string, password:string } ):Promise<any>{
    const salt:string = Math.random().toString();
    const password:string = await Users.generatePassword( user.password, salt );
    await this._model.create( { ...user, password, salt, status:'enabled' } );
  }

  public async updateUserNickname( user:{ email:string, nickname:string }  ):Promise<any>{
    await this._model.update( 
      { nickname:user.nickname }, 
      { where:{
        email: user.email  
      }} 
    ) 
  }

  public async updateUserStatus( user:{ email:string, status:string }  ):Promise<any>{
    await this._model.update( 
      { status:user.status }, 
      { where:{
        email: user.email  
      }} 
    ) 
  }

  public static generatePassword( password:string, salt:string ):string{
    return pbkdf2Sync( password, salt, 1000, 64, 'sha512').toString( 'base64' );
  }
}