import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

export default function RedirectButton({ path, text }) {
  return (
    <Button asChild>
      <NavLink to={path}>{text}</NavLink>
    </Button>
  );
}
