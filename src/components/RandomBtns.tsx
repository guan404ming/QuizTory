"use client";

import useAdmin from "@/hooks/useAdmin";

import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export default function RandomBtns() {
  const { createRandomUser } = useAdmin();

  const handleCreate = async () => {
    try {
      await createRandomUser();
      toast({
        title: "Successfully created 500 random users 😻",
        description: "See it in the homepage",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong 😿",
        description: `Error creating announcement`,
      });
    }
  };

  return (
    <div className="px-5">
      <Button onClick={async () => await handleCreate()}>
        Click to generate!
      </Button>
    </div>
  );
}
