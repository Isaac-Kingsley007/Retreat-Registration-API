import db from './db';

try{
    db.prepare(
        `create table if not exists participant(
            id integer primary key autoincrement,
            name text not null,
            age integer not null,
            phone_number text not null
        )`
    ).run();
} catch(error){
    console.error(error);
}

console.log('Table Created');