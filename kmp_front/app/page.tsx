import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center h-screen   ">
        <Link href={`/document/${uuidv4()}`}>
          <button className="btn btn-primary">Create a record</button>
        </Link>
      </div>
    </>
  );
}
