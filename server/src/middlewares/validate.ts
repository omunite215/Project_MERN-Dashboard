import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";

interface Schemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export function validate(schemas: Schemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);             // req.body is writable
      if (schemas.params) schemas.params.parse(req.params);                  // validate only; controllers use raw req.params.id
      if (schemas.query) res.locals.query = schemas.query.parse(req.query); // Express 5: req.query is read-only → stash parsed result
      next();
    } catch (err) {
      next(err);
    }
  };
}
