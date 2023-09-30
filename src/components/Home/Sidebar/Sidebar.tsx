import { useState, SetStateAction, memo } from 'react';
import { User } from 'firebase/auth';
import FirestoreService, { Group } from '@/services/firestore-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons';
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
import { Plus, Trash } from 'lucide-react';
import React from 'react';
import { DialogClose } from '@radix-ui/react-dialog';

type SidebarProps = {
    user: User,
    groups: Group[],
    fetchGroups: () => Promise<void>,
    activeGroup: Group | null,
    setActiveGroup: (group: Group) => void
};

const Sidebar = ({ user, groups, fetchGroups, activeGroup, setActiveGroup }: SidebarProps) => {

    const [newGroupName, setNewGroupName] = useState('');
    const [openDropDownMenu, setOpenDropDownMenu] = useState('');

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);

    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
    const [groupToAddMember, setGroupToAddMember] = useState<Group | null>(null);



    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setNewGroupName(event.target.value);
    };

    const handleClick = (group: Group) => {
        setActiveGroup(group);
        localStorage.setItem('activeGroup', JSON.stringify(group));
    };



    const deleteGroup = async (group: Group) => {
        if (user != null) {
            const firestoreService = FirestoreService.getInstance();
            try {
                await firestoreService.deleteGroup(group.id);
                fetchGroups();
                setDeleteDialogOpen(false)
            } catch (error) {

            }

        }
    }



    const onCreateGroup = async () => {
        const firestoreService = FirestoreService.getInstance();
        if (user && newGroupName != '') {
            await firestoreService.createGroup(user.uid, newGroupName);
            fetchGroups();
        }
    };

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');


    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const validateEmail = (email: string) => {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return regex.test(email);
    };

    const handleAddMember = async (event: React.FormEvent, groupId: string) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('This email is not valid');
        } else {
            setEmailError('');
            try {
                await FirestoreService.getInstance().addMemberToGroup(groupId, email)
                setAddGroupDialogOpen(false);
            } catch (e) {
                if (e instanceof Error) {
                    setEmailError(e.message);
                } else {
                    setEmailError('An unexpected error occurred');
                }
            }
            // Add member to group...
        }
    };

    return (
        <div className="w-full p-4">
            <div className='flex flex-col space-y-2'>
                {groups.map((group) => (
                    <React.Fragment key={group.id}>
                        <div className='flex w-full'>
                            <Button style={{ justifyContent: 'flex-start' }} className={`flex-grow ${activeGroup?.id === group.id ? "bg-accent text-accent-foreground" : ""}`} variant="ghost" onClick={() => handleClick(group)}>{group.name}</Button>

                            <DropdownMenu open={openDropDownMenu == group.id} onOpenChange={() => { setOpenDropDownMenu(''); setEmail(''); setEmailError(''); }}>
                                <DropdownMenuTrigger><Button className='p-2 hover:bg-transparent' variant={'ghost'}><DotsVerticalIcon onClick={() => setOpenDropDownMenu(group.id)}></DotsVerticalIcon></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{group.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => { setOpenDropDownMenu(''); setDeleteDialogOpen(true); setGroupToDelete(group); }}>
                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => { setOpenDropDownMenu(''); setAddGroupDialogOpen(true); setGroupToAddMember(group); setEmail(''); setEmailError(''); }}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Member
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Dialog open={deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(false)}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete group: {groupToDelete?.name}</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. <br /> Are you sure you want to permanently
                                            delete this group?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button type="submit" onClick={() => groupToDelete && deleteGroup(groupToDelete)}>delete group</Button>                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={addGroupDialogOpen} onOpenChange={() => setAddGroupDialogOpen(false)}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add members to {group.name}</DialogTitle>
                                        <form onSubmit={async (e) => {
                                            if (groupToAddMember) {
                                                await handleAddMember(e, groupToAddMember.id);
                                            }
                                        }}>
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                placeholder='Provide a valid E-Mail of a user...'
                                            />
                                            {emailError && <span>{emailError}</span>}
                                            <DialogFooter>
                                                <Button type="submit">Add Member</Button>
                                            </DialogFooter>
                                        </form>

                                    </DialogHeader>
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

export default memo(Sidebar);

