import Sequelize from 'sequelize'; 
import AbsModel from './abs-model';
import UsersModel from './models/users';
import GamesModel from './models/games';

const creationSymbol = Symbol();

class RDBConfig{

  private _config:any;

  public get username():string{ return this._config.username; }
  public get password():string{ return this._config.password; }
  public get database():string{ return this._config.database; }
  public get host():string{ return this._config.host; }
  public get port():string{ return this._config.port; }
  public get dialect():string{ return this._config.dialect; }
  public get configString():string{ return `${this.dialect}://${this.username}${ this.password ? ':'+this.password : '' }@${this.host}:${this.port}/${this.database}`; }

  constructor(){
    this._config = require( './config.json')[ 'dev' ]; 
  }
}

export default class RDBManager{

  private static _instance:RDBManager;

  public static getInstance():RDBManager{
    if( !RDBManager._instance ){
      RDBManager._instance = new RDBManager( creationSymbol );
    }
    return RDBManager._instance;
  }

  private _sequelize:Sequelize;
  private _config:RDBConfig;
  private _modelMap:Map<string, AbsModel>;

  get sequelize():Sequelize{ return this._sequelize; } 

  constructor( symbol ){
    if( creationSymbol !== symbol ){
      throw new Error( 'RDBManager클래스는 getInstace 클래스 메소드로 인스턴스를 생성할 수 있습니다.' );
    }
  }

  private async _connect():Promise<any>{
    this._config = new RDBConfig();
    this._sequelize = new Sequelize( this._config.configString, { define:{freezeTableName: true }} );
    return this._sequelize.authenticate()
      .then( ()=>{ 
        console.info( 'RDB 데이터베이스 연결 성공 : ', this._config.configString );
      })
      .catch( ( error )=>{
        console.info( 'RDB 데이터베이스 연결 실패 : ', this._config.configString );
        console.error( error );
      });
  }

  private _createModels():void{
    this._modelMap = new Map([
      [ 'users', new UsersModel( this._sequelize ) as AbsModel],
      [ 'games', new GamesModel( this._sequelize ) as AbsModel ]
    ]);
  }

  public async init():Promise<any>{
    await this._connect();
    this._createModels();
  }

  public getModel( modelName:string ):AbsModel{
    return this._modelMap.get( modelName );
  }
}