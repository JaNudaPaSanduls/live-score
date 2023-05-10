const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const user_routes = require('./routes/user.routes');
const match_routes = require('./routes/match.routes');
const public_routes = require('./routes/public.routes');


const PORT = process.env.PORT || 8060;

app.use(cors());
app.use(bodyParser.json());

const URI = process.env.MONGO_URL;

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log('MongoDB Connection Success!!!')
});

// Routes
app.use('/user', user_routes);
app.use('/match', match_routes);
app.use('', public_routes);

app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`)
});

app.use(async (req, res) => {
    res.status(404).send({ message: '404 Error' });
});