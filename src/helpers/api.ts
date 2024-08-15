import axios from "axios";

export async function getData({ sessionId }: { sessionId: string }) {
  const res = await axios.get(
    `http://localhost:3000/sdk/get-data?sessionId=${sessionId}`
  );

  return res.data as {
    sessionId: string;
    data: string;
    type: string;
  };
}
