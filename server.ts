import app from './app';  // Make sure app.ts is correctly typed

// Define the port type as a string or undefined
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
