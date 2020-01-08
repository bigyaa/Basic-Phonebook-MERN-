
const {PORT} = require('./utils/config');
const app = require('./controllers/people');
const {requestLogger, unknownEndpoint, errorHandler} = require('./utils/middleware');

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

app.use(errorHandler);
app.use(requestLogger);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
