import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Plus, Mail, Phone, Calendar, Edit, Trash } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';

// Correctly import the service and types
import { MemberService } from '../services/MemberService';
import { UserResponseDTO, UserRequestDto, Role } from '../dto/dto';

const Members = () => {
    // State for the master list of all members from the API
    const [allMembers, setAllMembers] = useState<UserResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // State for managing dialogs
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<UserResponseDTO | null>(null);

    const { toast } = useToast();

    // Fetches the master list of members from the API
    const fetchAllMembers = useCallback(async () => {
        setLoading(true);
        try {
            // Use the correct service method to get all members
            const data = await MemberService.getAllMembers();
            setAllMembers(data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to load members.", variant: "destructive" });
            setAllMembers([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Fetch data on initial component load
    useEffect(() => {
        fetchAllMembers();
    }, [fetchAllMembers]);
    
    // Perform client-side filtering whenever the master list, search term, or role filter changes
    const filteredMembers = useMemo(() => {
        return allMembers
            .filter(member => {
                // Use `searchTerm` directly instead of the debounced term
                const searchLower = searchTerm.toLowerCase();
                return (
                    member.firstName.toLowerCase().includes(searchLower) ||
                    member.lastName.toLowerCase().includes(searchLower) ||
                    member.email.toLowerCase().includes(searchLower)
                );
            })
            .filter(member => {
                return roleFilter === 'all' || member.role === roleFilter;
            });
    // Update dependency array to use `searchTerm`
    }, [allMembers, searchTerm, roleFilter]);

    // Handler for submitting the "Add Member" form
    const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const role = formData.get('role') as string;
        if (!["ADMIN", "LIBRARIAN", "MEMBER"].includes(role)) {
            toast({ title: "Error", description: "Invalid role selected.", variant: "destructive" });
            return;
        }
        const roleValue = formData.get('role')?.toString().toUpperCase(); // or keep original casing if needed

        if (!roleValue || !(roleValue in Role)) {
          throw new Error("Invalid role selected.");
        }
        
        const newMemberData: UserRequestDto = {
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          email: formData.get('email') as string,
          phoneNumber: formData.get('phone') as string,
          role: roleValue as Role,
        };

        try {
            await MemberService.addMember(newMemberData);
            toast({ title: "Success", description: "Member added successfully." });
            setIsAddDialogOpen(false);
            fetchAllMembers(); // Refresh the master list
        } catch (error) {
            toast({ title: "Error", description: "Failed to add member.", variant: "destructive" });
        }
    };

    // Handler for submitting the "Edit Member" form
    const handleUpdateMember = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingMember) return;

        const formData = new FormData(e.currentTarget);
        const updatedData: UserRequestDto = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phoneNumber: formData.get('phone') as string,
            role: formData.get('role') as Role,
        };

        try {
            await MemberService.updateMember(editingMember.id, updatedData);
            toast({ title: "Success", description: "Member updated successfully." });
            setIsEditDialogOpen(false);
            setEditingMember(null);
            fetchAllMembers(); // Refresh the master list
        } catch (error) {
            toast({ title: "Error", description: "Failed to update member.", variant: "destructive" });
        }
    };
    
    // Handler for deleting a member
    const handleDeleteMember = async (memberId: number) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;
        try {
            await MemberService.deleteMember(memberId);
            toast({ title: "Success", description: "Member has been deleted." });
            fetchAllMembers(); // Refresh the master list
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete member.", variant: "destructive" });
        }
    };
    
    // Opens the edit dialog with the selected member's data
    const openEditDialog = (member: UserResponseDTO) => {
        setEditingMember(member);
        setIsEditDialogOpen(true);
    };

    const getRoleBadgeClass = (role: Role) => {
        switch (role) {
            case Role.ADMIN: return 'bg-purple-100 text-purple-800 border-purple-300';
            case Role.LIBRARIAN: return 'bg-blue-100 text-blue-800 border-blue-300';
            case Role.MEMBER:
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Members</h1>
                    <p className="text-muted-foreground mt-1">Manage library member accounts</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Member</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>Add New Member</DialogTitle></DialogHeader>
                        <form onSubmit={handleAddMember} className="space-y-4 pt-4">
                            {/* Form fields for adding a member... */}
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label htmlFor="add-firstName">First Name</Label><Input id="add-firstName" name="firstName" required /></div>
                                <div><Label htmlFor="add-lastName">Last Name</Label><Input id="add-lastName" name="lastName" required /></div>
                            </div>
                            <div><Label htmlFor="add-email">Email</Label><Input id="add-email" name="email" type="email" required /></div>
                            <div><Label htmlFor="add-phone">Phone</Label><Input id="add-phone" name="phone" required /></div>
                            <div>
                                <Label htmlFor="add-role">Role</Label>
                                <Select name="role" required defaultValue={Role.MEMBER}>
                                    <SelectTrigger id="add-role"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Role.MEMBER}>User</SelectItem>
                                        <SelectItem value={Role.LIBRARIAN}>Librarian</SelectItem>
                                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit">Add Member</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value={Role.MEMBER}>Member</SelectItem>
                        <SelectItem value={Role.LIBRARIAN}>Librarian</SelectItem>
                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Members List */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-muted-foreground py-8">Loading members...</p>
                ) : filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                        <Card key={member.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-4 flex-1">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>{member.firstName?.[0]}{member.lastName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="font-semibold text-foreground">{member.firstName} {member.lastName}</h3>
                                            <Badge variant="outline" className={getRoleBadgeClass(member.role)}>{member.role}</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-2 truncate"><Mail className="w-4 h-4 flex-shrink-0" /><span>{member.email}</span></div>
                                            <div className="flex items-center space-x-2"><Phone className="w-4 h-4 flex-shrink-0" /><span>{member.phoneNumber}</span></div>
                                            <div className="flex items-center space-x-2"><Calendar className="w-4 h-4 flex-shrink-0" /><span>Joined {new Date(member.createdAt).toLocaleDateString()}</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 self-end sm:self-center">
                                    <Button variant="outline" size="icon" onClick={() => openEditDialog(member)}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDeleteMember(member.id)}><Trash className="w-4 h-4" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-8">No members found.</p>
                )}
            </div>

            {/* Edit Member Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>Edit Member</DialogTitle></DialogHeader>
                    {editingMember && (
                        <form onSubmit={handleUpdateMember} className="space-y-4 pt-4">
                           <div className="grid grid-cols-2 gap-4">
                                <div><Label htmlFor="edit-firstName">First Name</Label><Input id="edit-firstName" name="firstName" required defaultValue={editingMember.firstName} /></div>
                                <div><Label htmlFor="edit-lastName">Last Name</Label><Input id="edit-lastName" name="lastName" required defaultValue={editingMember.lastName} /></div>
                            </div>
                            <div><Label htmlFor="edit-email">Email</Label><Input id="edit-email" name="email" type="email" required defaultValue={editingMember.email} /></div>
                            <div><Label htmlFor="edit-phone">Phone</Label><Input id="edit-phone" name="phone" required defaultValue={editingMember.phoneNumber} /></div>
                            <div>
                                <Label htmlFor="edit-role">Role</Label>
                                <Select name="role" required defaultValue={editingMember.role}>
                                    <SelectTrigger id="edit-role"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Role.MEMBER}>User</SelectItem>
                                        <SelectItem value={Role.LIBRARIAN}>Librarian</SelectItem>
                                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button></DialogClose>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Members;