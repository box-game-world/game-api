

import Sequelize from 'sequelize'; 

export default abstract class AbsModel {

  protected _sequlize:Sequelize;
  protected _model;
  protected abstract _getModelName():string;
  protected abstract _getSchema():any;

  public get model():any{ return this._model; }

  constructor( sequlize:Sequelize ){
    this._sequlize = sequlize; 
    this._beforeDefine();
    this._model = this._sequlize.define(
      this._getModelName(),
      this._getSchema()
    ); 
    this._afterDefine();

    ( async ()=>{
      await this._model.sync();
      this._afterSync();
    } )();
  }

  protected _beforeDefine():void{}
  protected _afterDefine():void{}
  protected _afterSync():void{}
}