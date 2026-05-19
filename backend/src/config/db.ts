import env from './env';
import { PrismaClient } from '../../generated/prisma';
import {PrismaPg} from '@prisma/adapter-pg';


const adapter = new PrismaPg({connectionString : env.DATABASE_URL})
const prisma = new PrismaClient({ adapter });

const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with an error code
  }
}
export { prisma, connectToDatabase };