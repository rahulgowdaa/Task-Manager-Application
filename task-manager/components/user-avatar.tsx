import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "lg" | "xl";
}

export function UserAvatar({ user, size = "sm" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-20 w-20",
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("");
    }
    return user.email ? user.email[0].toUpperCase() : "";
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage
        src={user.image || user.avatarUrl || undefined} // Ensure fallback to `undefined` instead of `null`
        alt={user.name || user.email || "User Avatar"} // Provide a default alt text
      />
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
}
