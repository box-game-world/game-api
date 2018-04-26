


import AbsModel from '../abs-model';
import Sequelize from 'sequelize';

const MODEL_NAME:string = 'games';

const SCHEMA:any = {
  code:{ 
    type: Sequelize.STRING,
    primaryKey: true
  },

  name:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  
  desc:{
    type: Sequelize.STRING,
    allowNull: true,
  },

  url:{
    type: Sequelize.STRING,
    allowNull: false,
  }
}

export default class Games extends AbsModel{

  protected _getModelName():string{ return MODEL_NAME;}
  protected _getSchema():any{ return SCHEMA; }


  protected async _afterSync():Promise<any>{
    await this._model.destroy( { 
      whehe:{},
      truncate:true
    });
    
    await this._model.bulkCreate([ 
      { code:'GMCD01', name:'stick hero', desc:'stick hero', url:'http://sh.box-game-word.com' },
      { code:'GMCD02', name:'2048', desc:'2048 puzzle', url:'http://2048.box-game-word.com' }
    ]);
  }
}