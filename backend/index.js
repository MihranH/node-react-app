const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const Logger = require('./services/Logger');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(require('./router'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./dbConnection');

app.listen(PORT, () => {
    Logger.info(`Server is listening to port ${PORT}`);
});
