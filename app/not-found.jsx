import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[60vh] px-4  ">
      <h1 className="text-6xl font-bold title-gradient mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4 ">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        OOps! the page you are looking for does not exist or has been moved
      </p>
      <Link href={"/"}>
        <Button variant="journal">Return Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
