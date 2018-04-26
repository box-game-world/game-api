import App from '../App'
import RDBManager from '../database/rdb/rdb-manager'
import APIFacede from '../apis/api-facade'
import * as express from 'express'
import * as bodyParser from 'body-parser'


const app:express.Application = App.getInstance().app;

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true})); 

RDBManager.getInstance().init();  
APIFacede.init( app );

app.listen( 5000 , ()=>console.log( '포트:5000 연결 성공' ) );

