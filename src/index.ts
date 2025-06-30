import express from 'express';
import { config } from 'dotenv';
import logger from 'morgan';
import router from './route';

config();

const app = express();
const port = parseInt(process.env.PORT ?? '3000');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(logger('dev'));

app.use('/api', router);

app.get('/', (_req, res) => {
    res.status(404).send("App is active at <a href='/api'>/api</a> please make requests there");
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});