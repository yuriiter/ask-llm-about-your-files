import { promisedTimeout } from "@/utils/utils";
import { Home } from "@/views/Home";

const getData = async () => {
  await promisedTimeout(3000);
  return await fetch("https://google.com").then((res) => res.text());
};

export default async function page() {
  const data = await getData();

  return (
    <main>
      <Home />
      {data}
    </main>
  );
}
