import FirestoreService, { Group } from '@/services/firestore-service';
import React, { useContext, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Settings, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ActiveGroupContext, FetchGroupsContext } from '../../Home';

const GroupHeader = () => {

    const user = useContext(UserContext);
    const { activeGroup } = useContext(ActiveGroupContext)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);

    const fetchGroupsContext = useContext(FetchGroupsContext);


    const deleteGroup = async (group: Group) => {
        if (user != null) {
            const firestoreService = FirestoreService.getInstance();
            try {
                await firestoreService.deleteGroup(group.id);
                fetchGroupsContext?.fetchGroups();
                setDeleteDialogOpen(false)
            } catch (error) {

            }

        }
    }

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
        <div className='w-full'>
            <div className='flex justify-between w-full'>
                {activeGroup ? <h1 className='text-2xl font-bold'>{activeGroup.name}</h1> : <h1 className='text-2xl font-bold'>No Group Selected</h1>}
                <DropdownMenu onOpenChange={() => { setEmail(''); setEmailError(''); }}>
                    <DropdownMenuTrigger>
                        <Settings />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>{activeGroup?.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => { setDeleteDialogOpen(true); }}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => { setAddGroupDialogOpen(true); setEmail(''); setEmailError(''); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Member
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete group: {activeGroup?.name}</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. <br /> Are you sure you want to permanently
                            delete this group?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="submit" onClick={() => activeGroup && deleteGroup(activeGroup)}>delete group</Button>                                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={addGroupDialogOpen} onOpenChange={() => setAddGroupDialogOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add members to {activeGroup?.name}</DialogTitle>
                        <form onSubmit={async (e) => {
                            if (activeGroup) {
                                await handleAddMember(e, activeGroup.id);
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
    );
};

export default GroupHeader;
