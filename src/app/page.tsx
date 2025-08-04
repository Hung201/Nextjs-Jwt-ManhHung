import { auth } from "@/auth";
import { Homepage } from "@/components/features/layout/common";

export default async function Home() {
  const session = await auth()
  console.log("check session: ", session)
  return (
    <div>
      <Homepage />
    </div>
  );
}
