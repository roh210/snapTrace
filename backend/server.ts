import env from './src/config/env';
import app from './src/app';
import { prisma, connectToDatabase } from './src/config/db';
import redis from './src/config/redis';

const port: number = env.PORT;

const startup = async () => {
      await connectToDatabase()
      app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
      })
}


startup()