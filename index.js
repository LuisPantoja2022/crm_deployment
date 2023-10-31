const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({ path: 'variables.env'});

//cors permite que un cliente se conecte a otro servidor para el intercambio de recursos
const cors = require('cors');

//conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a la base de datos establecida con éxito');
}).catch(err => console.log(err));

//crear el servidor 
const app = express();

//carpeta publica
app.use(express.static('uploads')); 


//habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//definir un dominio(s) para recibir las peticiones
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        //revisar si la peticion viene de un servidor que esta en whiteList
        const existe = whiteList.some( dominio => dominio === origin );
        if(existe) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}


//habilitar cors
app.use(cors(corsOptions));

//Rutas de la app
app.use('/', routes());


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

//puerto
app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});
