"use client";

import { useState } from "react";

import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CommandInput,
  CommandEmpty,
  CommandItem,
  Command,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import useAdmin from "@/hooks/useAdmin";

type RoleBlockProps = {
  userData: {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Blocked" | "Normal";
  }[];
};

export default function RoleBlock({ userData }: RoleBlockProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [role, setRole] = useState<"Admin" | "Blocked" | "Normal">("Normal");
  const { setUserRole, loading } = useAdmin();

  function getLabelById() {
    const changee = userData.find((user) => `${user.id}` === selectedUserId);
    if (changee) {
      return (
        <div className="flex">
          <Badge className="mr-2 flex w-[70px] flex-col max-sm:hidden">
            {changee.role}
          </Badge>
          <p className="truncate">{`${changee.email}`}</p>
        </div>
      );
    } else {
      return "User not found!";
    }
  }

  const handleSubmit = async () => {
    const changee = userData.find((user) => `${user.id}` === selectedUserId);
    if (!changee) return;
    try {
      await setUserRole({ changeeId: changee.id, role });
      toast({
        title: `Successfully set ${changee.id} to ${role}!`,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong 😿",
        description: `Error setting user role`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-left">
        <Card className="cursor-pointer">
          <CardHeader>
            <CardTitle>Role</CardTitle>
            <CardDescription>Toggle user role</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Toggle user role</DialogTitle>
          <DialogDescription>select and toggle</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          <p className="my-4 font-bold">User</p>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {selectedUserId ? getLabelById() : "Select user..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="z-10 w-[375px] p-0 drop-shadow-lg max-sm:w-[250px]"
              align="start"
            >
              <Command className="max-h-[300px] overflow-scroll">
                <CommandInput placeholder="Search user..." />
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandList>
                  {userData.map((user) => (
                    <CommandItem
                      key={user.id}
                      className="px-4 py-2"
                      value={JSON.stringify(user)}
                      onSelect={(currentValue) => {
                        setSelectedUserId(
                          currentValue === selectedUserId ? "" : `${user.id}`,
                        );
                        setOpen(false);
                      }}
                    >
                      <div className="flex">
                        <Badge className="mr-2 flex w-[70px] flex-col max-sm:hidden">
                          {user.role}
                        </Badge>
                        <p className="truncate">{`${user.email}`}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <p className="my-4 font-bold">Role</p>

          <Select
            defaultValue="Normal"
            onValueChange={(value: "Admin" | "Blocked" | "Normal") =>
              setRole(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            className="round-xl mt-2"
            onClick={() => handleSubmit()}
            disabled={loading}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
