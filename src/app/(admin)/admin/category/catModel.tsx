"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaEye, FaFileAlt } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import BanM from "./banM";
import { FaF } from "react-icons/fa6";
import CatForm from "./catForm";



export default function BannwerModalLogo() {


  return (
    <Dialog>
      <DialogTrigger asChild>
      <span>
          <Button>
       <FaFileAlt />
         Add Category
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
         Add Category
          </DialogDescription>
        </DialogHeader>
 
    <CatForm />
      </DialogContent>
    </Dialog>
  );
}
