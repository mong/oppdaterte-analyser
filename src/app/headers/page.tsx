import { headers } from "next/headers";

export default async function HeadersPage() {
  const headerList = await headers();

  return (
    <>
      <h1>Request Headers</h1>
      <ul>
        {Array.from(headerList.entries()).map(([key, value]) => (
          <li key={key}>
            <strong>{key}</strong>: {value}
          </li>
        ))}
      </ul>
    </>
  );
}
