'use client';

import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

interface Proposal {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface ProposalDrawerProps {
  open: boolean;
  onClose: () => void;
  proposal: Proposal | null;
}

const ProposalDrawer: React.FC<ProposalDrawerProps> = ({ open, onClose, proposal }) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{proposal?.title}</DrawerTitle>
          <DrawerDescription>{proposal?.description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={() => alert('Vote submitted!')}>Vote</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProposalDrawer;
