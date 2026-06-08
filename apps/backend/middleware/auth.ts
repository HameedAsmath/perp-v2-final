import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

// export function authMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader?.startsWith("Bearer ")) {
//     res.status(401).json({
//       error: "missing or invalid authorization header",
//     });
//     return;
//   }

//   const token = authHeader.slice("Bearer ".length);

//   try {
//     const payload = verifyToken(token);
//     if (payload.userId) {
//       next();
//       return;
//     }
//   } catch {
//     res.status(401).json({
//       error: "invalid or expired token",
//     });
//   }
// }
