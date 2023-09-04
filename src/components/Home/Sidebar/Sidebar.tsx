import { useState, useEffect, SetStateAction } from 'react';
import { User } from 'firebase/auth';
import FirestoreService, { Group } from '@/services/firestore-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@radix-ui/react-separator';
import { Cross1Icon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons';

const Sidebar = ({ user, activeGroup, setActiveGroup }: { user: User, activeGroup: Group | null, setActiveGroup: (group: Group) => void }) => {
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
            const confirmDelete = window.confirm('Are you sure you want to delete this group?');
            if (confirmDelete) {
                const firestoreService = FirestoreService.getInstance();
                await firestoreService.deleteGroup(group.id);
                fetchGroups();
            }
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
        <div className="w-64 bg-gray-200 p-4">
            <div className='flex flex-col space-y-4'>
                <h1 className='text-2xl font-bold'>Groups</h1>
                {groups.map((group) => (
                    <div className='flex space-x-2 w-full'>
                        <Button className='flex-grow group-button' variant={activeGroup?.id === group.id ? "default" : "outline"} onClick={() => handleClick(group)}>{group.name}</Button>
                        <Button onClick={() => deleteGroup(group)} variant='destructive'> <Cross2Icon></Cross2Icon> </Button>
                    </div>
                ))}
                <Separator></Separator>
                <div className='flex space-x-2'>
                    <Input type="text" value={newGroupName} onChange={handleInputChange} />
                    <Button onClick={onCreateGroup}> <PlusIcon></PlusIcon> </Button>
                </div>

            </div>

        </div>
    );
};

export default Sidebar;
