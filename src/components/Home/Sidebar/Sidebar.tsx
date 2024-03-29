import { useState, SetStateAction, memo, useContext } from 'react';
import FirestoreService, { Group } from '@/services/firestore-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon } from '@radix-ui/react-icons';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { UserContext } from '@/App';
import { ActiveGroupContext } from '../Home';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type SidebarProps = {
    groups: Group[],
    fetchGroups: () => Promise<void>,
};

const Sidebar = ({ groups, fetchGroups }: SidebarProps) => {

    const user = useContext(UserContext);
    const [newGroupName, setNewGroupName] = useState('');
    const { activeGroup, setActiveGroup } = useContext(ActiveGroupContext);

    const onCreateGroup = async () => {
        const firestoreService = FirestoreService.getInstance();
        if (user && newGroupName != '') {
            await firestoreService.createGroup(user.uid, newGroupName);
            fetchGroups();
        }
    };

    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setNewGroupName(event.target.value);
    };

    const handleClick = (group: Group) => {

        setActiveGroup && setActiveGroup(group);
        localStorage.setItem('activeGroup', JSON.stringify(group));

    };


    return (

        <div className="w-full pl-0 p-4">
            <div className='flex flex-col space-y-2'>
                {groups.map((group) => (
                    <React.Fragment key={group.id}>
                        <div className='flex w-full'>
                            <Button className={`flex flex-grow justify-start text-lg h-12 rounded-tl-none rounded-bl-none ${activeGroup?.id === group.id ? "bg-accent text-accent-foreground" : ""}`} variant="ghost" onClick={() => handleClick(group)}>  <Avatar className='mr-4'>
                                <AvatarFallback></AvatarFallback>
                            </Avatar> 
                            {group.name.length > 15 ? group.name.substring(0, 15) + "..." : group.name}
                            </Button>
                        </div>
                        <Separator></Separator>
                    </React.Fragment>
                ))}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}}><PlusIcon></PlusIcon></Button>
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

