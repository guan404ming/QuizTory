import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

import { BookOpen, Home, UploadCloud, HelpCircle, UserCog } from "lucide-react";

import quiztory from "@/assets/quiztory.png";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";

import ProfileButton from "./ProfileButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    // aside is a semantic html tag for side content
    <aside className="flex h-screen flex-col justify-between px-6 py-6 max-md:px-4 max-sm:px-2">
      <div className="flex flex-col gap-2">
        <div className="p-2">
          <Link href="/">
            <Image src={quiztory} alt="quiztory" width={40} height={40} />
          </Link>
        </div>
        <HeaderButton Icon={Home} text="Home" router="/" />
        <HeaderButton Icon={BookOpen} text="Course" router="/course" />
        <HeaderButton Icon={UploadCloud} text="Upload" router="/upload" />
        {session?.user.role === "Admin" && (
          <HeaderButton Icon={UserCog} text="Admin" router="/admin" />
        )}
        <HeaderButton Icon={HelpCircle} text="Help" router="/help" />
      </div>
      <ProfileButton />
    </aside>
  );
}

type HeaderButtonProps = {
  Icon: React.ComponentType<{
    size?: number | string;
    strokeWidth?: number | string;
  }>;
  text: string;
  active?: boolean;
  router: string;
};

function HeaderButton({ Icon, text, active, router }: HeaderButtonProps) {
  return (
    <Link href={`${router}`}>
      <button className="group w-full">
        <div className="flex w-fit items-center gap-4 rounded-full p-2 transition-colors duration-300 group-hover:bg-gray-200 lg:pr-4">
          <div className="grid h-[40px] w-[40px] place-items-center">
            <Icon size={26} strokeWidth={active ? 3 : 2} />
          </div>
          <span className={cn("text-xl max-lg:hidden", active && "font-bold")}>
            {text}
          </span>
        </div>
      </button>
    </Link>
  );
}
