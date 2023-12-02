"use client";

import { useState } from "react";

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

type RoleBlockProps = {
  userData: {
    id: number;
    name: string;
    email: string;
  }[];
};

export default function RoleBlock({ userData }: RoleBlockProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [role, setRole] = useState<"Admin" | "Blocked" | "Normal">("Normal");

  function getLabelById() {
    const file = userData.find((user) => `${user.id}` === selectedUserId);
    if (file) {
      return `${file.name} - ${file.email}`;
    } else {
      return "User not found!";
    }
  }

  const handleSubmit = () => {
    console.log(role, selectedUserId);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Toggle user role</DialogTitle>
          <DialogDescription>select and toggle</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          <p className="my-4 font-bold">File</p>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
              >
                {selectedUserId ? getLabelById() : "Select file..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="z-10 w-[375px] p-0 drop-shadow-lg"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Search file..." />
                <CommandEmpty>No file found.</CommandEmpty>
                {userData.map((file) => (
                  <CommandItem
                    key={file.id}
                    className="px-4"
                    value={JSON.stringify(file)}
                    onSelect={(currentValue) => {
                      setSelectedUserId(
                        currentValue === selectedUserId ? "" : `${file.id}`,
                      );
                      setOpen(false);
                    }}
                  >
                    {`${file.name} - ${file.email}`}
                  </CommandItem>
                ))}
              </Command>
            </PopoverContent>
          </Popover>

          <p className="my-4 font-bold">Status</p>

          <Select
            defaultValue="Normal"
            onValueChange={(value: "Admin" | "Blocked" | "Normal") =>
              setRole(value)
            }
          >
            <SelectTrigger className="w-[180px]">
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
          <Button className="round-xl" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
