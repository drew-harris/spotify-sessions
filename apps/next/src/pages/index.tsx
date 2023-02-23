import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data } = trpc.hello.useQuery({ text: "Drew" });
  return <div>{data ? data.message : null}</div>;
}
