import { createClient } from 'redis';

export async function redisCacheSetEx(key: any, expiration: any, data: any) {
  const redisClient = createClient({ url: 'redis://marcAllen:Dadeimomei0011!!@redis-10152.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:10152' });
  redisClient.on('error', err => console.log(err));
  await redisClient.connect();
  await redisClient.setEx(key, expiration, JSON.stringify(data));
  const redisCacheValue = await redisClient.get(key);
  console.log(`RedisCache_${key}`, redisCacheValue);
}

export async function redisCacheGet(key: any) {
  const redisClient = createClient({ url: 'redis://marcAllen:Dadeimomei0011!!@redis-10152.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:10152' });
  redisClient.on('error', err => console.log(err));
  await redisClient.connect();
  const redisCacheValue = await redisClient.get(key);
  console.log(`RedisCache_${key}`, redisCacheValue);
  return JSON.parse(redisCacheValue);
}
