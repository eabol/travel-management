import app from '../index.js';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on port ${port}`);
});
