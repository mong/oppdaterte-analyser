import { loginCredentials } from "@/lib/authorization";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HeadersPage() {
  const headerList = await headers();

  const credentials = await loginCredentials();
  if (!credentials) {
    redirect("/login");
  }

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
