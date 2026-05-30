import env from './src/config/env';
import app from './src/app';
import {connectToDatabase } from './src/config/db';
import redis from './src/config/redis';
import { start, shutdown } from './src/services/analytics.service';


const port: number = env.PORT;

const startup = async () => {
      await connectToDatabase()
      start()
      app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
      })
      process.on('SIGINT', async () => {
            await shutdown()
            process.exit(0)
      }
      )
      process.on('SIGTERM', async () => {
            await shutdown()
            process.exit(0)
      })
}


startup()