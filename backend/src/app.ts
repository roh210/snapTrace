import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middleware/error';
import healthRoute from './routes/health.routes';
import urls from './routes/url.routes'
import redirectRoutes from './routes/redirect.routes'
import eventsRoutes from './routes/events.routes'
import cors from 'cors';

const app: Application = express();

// Middleware to enable CORS adds Access-Control-Allow-Origin header to responses, allowing cross-origin requests from any domain. This is useful for APIs that will be accessed from web applications hosted on different domains.
app.use(cors())

// Middleware to parse JSON bodies
app.use(express.json());

// Registering routes
app.use('/api', healthRoute);
app.use('/api/urls', urls)
app.use('/api', eventsRoutes)
app.use('/', redirectRoutes)

//catch unmatched routes first
app.use((req: Request, res: Response) => {
  res.status(404).send({ errors: [{ message: "Route not found" }] });
});

// catches thrown errors last
app.use(errorHandler)


export default app;