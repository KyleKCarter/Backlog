import { Request, Response, NextFunction } from "express";

const logout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destry();
    res.status(200).json(req.session)
}

module.exports = {
    logout
}