import { motion } from "framer-motion";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/authStore";

const ProfileBadge = () => {
  const { user } = useAuthStore();
  if (user == null) return;
  return (
    <Link to="/dashboard" className=" flex items-center gap-3 hover:opacity-60">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative"
      >
        <Avatar className="h-10 w-10 border-2 border-teal-200">
          <AvatarImage
            alt={user.firstName?.charAt(0) + user.lastName?.charAt(0)}
          />
          <AvatarFallback>
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
        />
      </motion.div>
      <div>
        <p className="font-medium text-gray-900">
          {user?.role == "DOCTOR" && "Dr."} {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
    </Link>
  );
};

export default ProfileBadge;
