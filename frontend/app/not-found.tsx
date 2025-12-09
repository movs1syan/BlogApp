import Link from 'next/link'
import { AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600 mt-15">
      <AlertCircle size={85} className="mb-4 opacity-70" />
      <h2 className="text-3xl font-semibold mt-7">No Page Found</h2>
      <p className="mt-2 max-w-sm">
        The page you’re looking for doesn’t exist. We’ll help you get back on track.
      </p>
      <Link href="/" className={"mt-7"}>
        <Button type={"link"} icon={"CornerDownLeft"}>Return</Button>
      </Link>
    </div>
  );
}