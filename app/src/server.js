const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`Kanban app listening on port ${env.port}`);
});
