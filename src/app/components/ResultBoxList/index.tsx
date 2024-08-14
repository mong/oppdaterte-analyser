import "@mui/material";
import Paper from "@mui/material/Paper";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getResults = async () => {
  await delay(3000);
  return [1, 2, 3];
};

export default async function ResultBoxList() {
  const results = await getResults();

  return (
    <Paper>
      {results.map((result: number) => {
        return <div key={result}>{result}</div>;
      })}
    </Paper>
  );
}
