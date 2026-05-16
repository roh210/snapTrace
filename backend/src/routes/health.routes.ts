import { Router, Request, Response } from 'express';

interface HealthCheck {
    uptime: number,
    status: 'OK' | 'Pending' | 'Error',
    timestamp: number
}
const router: Router = Router();
//Basic Health Check Route  GET/HEALTH

router.get('/health', (req: Request, res: Response) => {
    const healthCheck: HealthCheck = {
        uptime: process.uptime(),
        status: 'OK',
        timestamp: Date.now()
    }

    res.status(200).json(healthCheck);
})

export default router;