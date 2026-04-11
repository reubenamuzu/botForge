import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  err: Error & { statusCode?: number; code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err.name === 'LimitError') {
    res.status(403).json({ error: err.message, code: 'LIMIT_EXCEEDED' })
    return
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation error', details: err.errors })
    return
  }
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Internal server error' })
}
