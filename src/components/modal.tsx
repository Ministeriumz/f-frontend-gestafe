"use client";

import React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ children, isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-fit max-w-[90vw] overflow-auto sm:max-w-[90vw]">
        {children}
      </DialogContent>
    </Dialog>
  );
}
