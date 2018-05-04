
import * as ioredis from 'ioredis';
const redisClient:any = new ioredis( 32768, 'localhost' );
export default redisClient;