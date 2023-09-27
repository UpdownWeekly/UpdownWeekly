import { useState, useEffect, SetStateAction } from 'react';
import { User } from 'firebase/auth';
import FirestoreService, { Group } from '@/services/firestore-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotsVerticalIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import {
    DropdownMenu,

    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Trash } from 'lucide-react';
import React from 'react';
import { DialogClose } from '@radix-ui/react-dialog';

type SidebarProps = {
    user: User,
    activeGroup: Group | null,
    setActiveGroup: (group: Group) => void
};

const Sidebar = ({ user, activeGroup, setActiveGroup }: SidebarProps) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [newGroupName, setNewGroupName] = useState('');

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setNewGroupName(event.target.value);
    };

    const handleClick = (group: Group) => {
        setActiveGroup(group);
    };

    const fetchGroups = async () => {
        if (user != null) {
            const firestoreService = FirestoreService.getInstance();
            const groups = await firestoreService.getGroups(user.uid);
            setGroups(groups)
        }
    }

    const deleteGroup = async (group: Group) => {
        if (user != null) {
            const firestoreService = FirestoreService.getInstance();
            await firestoreService.deleteGroup(group.id);
            fetchGroups();
        }
    }

    useEffect(() => {
        fetchGroups();
    }, [user]);

    const onCreateGroup = async () => {
        const firestoreService = FirestoreService.getInstance();
        if (user && newGroupName != '') {
            await firestoreService.createGroup(user.uid, newGroupName);
            fetchGroups();
        }
    };

    return (
        <div className="w-full p-4">
            <div className='flex flex-col space-y-2'>
                {groups.map((group) => (
                    <React.Fragment key={group.id}>
                        <div className='flex w-full'>
                            <Button style={{ justifyContent: 'flex-start' }} className={`flex-grow ${activeGroup?.id === group.id ? "bg-accent text-accent-foreground" : ""}`} variant="ghost" onClick={() => handleClick(group)}>{group.name}</Button>
                            <Dialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger><DotsVerticalIcon></DotsVerticalIcon></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>{group.name}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem> <Trash className="mr-2 h-4 w-4" /> delete</DropdownMenuItem>
                                        </DialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. Are you sure you want to permanently
                                            delete this file from our servers?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button type="submit" onClick={() => deleteGroup(group)}>Confirm</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <Separator></Separator>
                    </React.Fragment>
                ))}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusIcon></PlusIcon></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Group</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            <Input type="text" value={newGroupName} onChange={handleInputChange} />
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose>
                                <Button onClick={onCreateGroup}>Submit</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>

        </div>
    );
};

export default Sidebar;
