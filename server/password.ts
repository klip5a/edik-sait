import { createPasswordHash } from './auth.js'

const password = process.argv[2]
if (!password) throw new Error('Usage: npm run password:hash -- "your password"')
console.log(createPasswordHash(password))
