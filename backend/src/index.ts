import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript backend!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
