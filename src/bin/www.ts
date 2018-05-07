import App from '../App'
import RDBManager from '../database/rdb/rdb-manager'
import APIFacede from '../apis/api-facade'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session'

const app:express.Application = App.getInstance().app;

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true}) ); 
app.use( cookieParser() ); 
app.use( session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}) );

RDBManager.getInstance().init();  
APIFacede.init( app );

app.listen( 7001 , ()=>console.log( '포트:7001 연결 성공' ) );

