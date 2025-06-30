import { Router, Request, Response } from "express";
import db from './db';
import { config } from "dotenv";

config();

interface Participant{
    id?: number,
    name: string,
    age: number,
    phone_number: string,
    team_number?: number,
    color?: string
};

const router = Router();

const colors = [
    'blue',
    'green',
    'red',
    'yellow',
    'pink',
    'orange'
];

router.get('/', (_req: Request, res: Response) => {
    res.send("Please make requsts for registration");
});

router.get('/getall', (_req: Request, res: Response) => {

    try{
        const data: Participant[] = db.prepare(
            `select id, name, age, phone_number, ((id - 1) % ?) + 1 as team_number
            from participant`
        ).all(colors.length) as Participant[];

        data.forEach((data) => data.color = colors[data.team_number! - 1])

        res.send(data);
    } catch(error){
        console.log((error as any)?.message ?? error);
        res.status(500).send("Internal Server Error");
    }

});

router.get('/getone/:id', (req: Request, res: Response) => {

    const id = parseInt(req.params.id);

    if(isNaN(id)){
        res.status(404).send("Not Found. id should be an Integer");
        return;
    }

    try{
        const data: Participant = db.prepare(
            `select id, name, age, phone_number, ((id - 1) % ?) + 1 as team_number
            from participant
            where id = ?`
        ).get(colors.length, id) as Participant;

        if(!data){
            res.status(404).send("Participant not found");
            return;
        }

        data.color = colors[data.team_number! - 1];

        res.send(data);
        return;
    } catch(error){
        console.log((error as any)?.message ?? error);
        res.status(500).send("Internal Server Error");
        return;
    }

});

router.post('/add', (req: Request, res: Response) => {

    const {name, age, phone_number}: Participant = req.body;

    if(!(name && Number.isInteger(age) && phone_number)){
        res.status(400).send("'name', 'age', 'phone_number' is required and age should be an Integer");
        return;
    }

    if(age < 13){
        res.status(400).send("'age' should be greater Than or equal to 13");
        return;
    }

    try{
        const rowId = db.prepare(
            `insert into participant
            (name, age, phone_number)
            values (?, ?, ?)`
        ).run(name, age, phone_number).lastInsertRowid;

        const teamNumber = (Number(rowId) - 1) % colors.length;

        res.send(`Registered ${name}. You are team ${colors[teamNumber]}!`)
    } catch(error: unknown){
        console.log((error as any)?.message ?? error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/delete', (req: Request,res: Response) =>{

    const password: string = req.body.password;

    if(!password){
        res.status(400).send("'password' is required");
        return;
    }

    if(password !== process.env.PASSWORD){
        res.status(409).send("Wrong Password");
    }

    try{
        db.prepare(
            `delete from participant`
        ).run()

        res.send("Delete Successfull");
    } catch(error){
        console.log((error as any)?.message ?? error);
        res.status(500).send("Internal Server Error");
    }

});


export default router;