import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const storeCors = process.env.STORE_CORS || 'http://localhost:8000'
const adminCors = process.env.ADMIN_CORS || process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const authCors =
  process.env.AUTH_CORS ||
  [process.env.STORE_CORS, process.env.ADMIN_CORS].filter(Boolean).join(',') ||
  'http://localhost:8000,http://localhost:9000'

const databaseDriverOptions =
  process.env.NODE_ENV === 'production' && process.env.DATABASE_REQUIRE_SSL === 'true'
    ? {
        connection: {
          ssl: {
            rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
          },
        },
      }
    : {}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions,
    redisUrl: process.env.REDIS_URL,
    workerMode:
      (process.env.MEDUSA_WORKER_MODE ||
        process.env.WORKER_MODE ||
        'shared') as 'shared' | 'worker' | 'server',
    http: {
      storeCors,
      adminCors,
      authCors,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === 'true',
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
})
