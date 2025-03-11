const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Successfully called server GET request'})
});

app.post('/', (req, res) => {
    const reqBody = req.body.prompt;
    res.json({message: `hellooo POST ${reqBody}`});
})

app.listen(8080, () => {
    console.log('server listening on 8080')
});
