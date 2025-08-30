import dotenv from 'dotenv';
import { resolve } from 'path';

// 환경별 .env 파일 로드
export function loadEnvConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // 기본 .env 파일 로드
  dotenv.config();
  
  // 환경별 .env 파일 오버라이드
  const envFile = nodeEnv === 'production' ? '.env.production' : '.env.local';
  dotenv.config({ path: resolve(process.cwd(), envFile), override: true });
  
  // 필수 환경 변수 검증
  const requiredEnvVars = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
  
  return {
    nodeEnv,
    databaseUrl: process.env.DATABASE_URL!,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    port: process.env.PORT || '3004',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };
}

// 환경별 설정 타입
export interface EnvConfig {
  nodeEnv: string;
  databaseUrl: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  port: string;
  appUrl: string;
}