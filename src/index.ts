import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();

// Middlewares
const bodyparser = require('body-parser');

const port = process.env.PORT || 4500;

// Use body-parser
app.use(bodyparser.json());

// Allow cross site access
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Default landing endpoint if ever other one fails
app.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).json({ message: 'Welcome to  Pod Manager. **winks**' }));

app.listen(port, () => {
  console.log(`server starting on port: ${port}`)
});