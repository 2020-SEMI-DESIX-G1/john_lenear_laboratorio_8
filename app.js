require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const connectDb = require('./dbConfig');
const Estudiantes = require('./models/Estudiantes');

const PORT = 3000;


// Configuracion
app.set('view engine', 'pug');
app.set('views', './views');


// Intermediarios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


// Controladores - Views

//Mostrar estudiantes
app.get('/estudiantes', async (req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes', { estudiantes });
});

//Mostrar Estudiante especifico por ID
app.get('/estudiantes/:id', async (req, res) => {
    try {
        const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.render('estudiantes_detail', { estudiante });
    } catch (error) {
        console.log(error);
        throw error;
    }
});

app.post('/estudiantes', async (req, res) => {
    const { nombre, edad } = req.body;
    await Estudiantes.create({ nombre, edad });
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.render('estudiantes', { estudiantes });
});

//Modificar
app.post('/estudiantes/:id', async (req, res) => {
    
    if(req.body.button_1){
        const { nombre, edad } = req.body;  
        await Estudiantes.findById(req.params.id).update({ nombre, edad });
        const estudiantes = await Estudiantes.find().select('nombre edad');
        res.redirect('/estudiantes');
    }
    
    if(req.body.button_2)
    {
        await Estudiantes.findByIdAndDelete(req.params.id);
        const estudiantes = await Estudiantes.find().select('nombre edad');
        res.redirect('/estudiantes');
    }
});

// Controladores - API
app.get('/api/estudiantes/', async (req, res) => {
    const estudiantes = await Estudiantes.find().select('nombre edad');
    res.json({
        estudiantes,
        cantidad: estudiantes.length
    });
});
app.post('/api/estudiantes/', async (req, res) => {
    const { nombre, edad } = req.body;
    await Estudiantes.create({ nombre, edad });
    res.json({ nombre, edad });
});
app.get('/api/estudiantes/:id', async (req, res) => {
    try {
       
        const estudiantes = await Estudiantes.findById(req.params.id).select('nombre edad');
        res.json({estudiantes});
    } catch (error) {
        console.log(error);
        
        res.json({});
    }
});

app.put('/api/estudiantes/:id', async (req, res) => {

    const { nombre, edad } = req.body;
    await Estudiantes.findByIdAndUpdate(req.params.id, { nombre, edad });
    res.json({ nombre, edad });

    });

app.delete('/api/estudiantes/:id' ,async (req ,res) => {
    const estudiante = await Estudiantes.findById(req.params.id).select('nombre edad');
    res.json(estudiante);
    await Estudiantes.findByIdAndDelete(req.params.id);
}); 
    


connectDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Ejecutando en el puerto ${PORT}`);
    });
});