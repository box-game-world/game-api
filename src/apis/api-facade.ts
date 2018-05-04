
import express from 'express';

import users from './users';
import login from './login';
import auth from './auth';

export default class APIFacede{

  public static init( app:express.Application ):void{
    app.use( '/users', users );
    app.use( '/login', login );
    app.use( '/auth', auth );
  }
}