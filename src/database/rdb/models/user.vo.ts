
export default class UserVo{
  
  public no:string;
  public email:string;
  public nickname:string;

  constructor( user:{ no:string, email:string, nickname: string } ){
    this.no = user.no;
    this.email = user.email;
    this.nickname = user.nickname;
  }
}