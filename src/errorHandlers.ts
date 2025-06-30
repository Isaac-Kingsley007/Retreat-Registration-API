import {Response} from 'express'

export function internalError(res: Response, error: any){
    console.log("internal Error Message : " + error.message);
    res.status(500).send("Internal Server Error");
}