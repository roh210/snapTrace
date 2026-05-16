import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middleware/error';
import healthRoute from './routes/health.routes';

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Registering routes
app.use('/api', healthRoute);

//catch unmatched routes first
app.use((req: Request, res: Response) => {
  res.status(404).send({ errors: [{ message: "Route not found" }] });
});

// catches thrown errors last
app.use(errorHandler)


export default app;