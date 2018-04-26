

import * as express from 'express';
 
const creationSymbol = Symbol();

export default class App{

  private static _instance:App;

  public static getInstance():App{
    if( !App._instance ){
      App._instance = new App( creationSymbol );
    }
    return App._instance;
  }

  private _app:express.Application;

  constructor( symbol ){
    if( symbol !== creationSymbol ){
      throw new Error( 'App클래스는 getInstace 클래스 메소드로 인스턴스를 생성할 수 있습니다.' );
    }
    this._app = express();
  }

  get app():express.Application{
    return this._app;
  }
}