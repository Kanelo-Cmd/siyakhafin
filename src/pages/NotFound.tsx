import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Logo } from "@/components/features/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="mt-8 font-display text-6xl font-800 text-primary">404</p>
      <h1 className="mt-2 font-display text-2xl font-700 text-ink">Page not found</h1>
      <p className="mt-1 text-muted-foreground">This page doesn't exist or has moved.</p>
      <Link to="/">
        <Button className="mt-6">Back to home</Button>
      </Link>
    </div>
  );
}
