import React, { useState } from 'react';
import { Search, ShieldAlert, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dummyUsers = [
  { id: 'usr_1', name: 'Admin User', email: 'admin@buyzaar.com', role: 'ADMIN', status: 'Active', joinedAt: '2023-11-15' },
  { id: 'usr_2', name: 'John Doe', email: 'john@example.com', role: 'USER', status: 'Active', joinedAt: '2024-01-20' },
  { id: 'usr_3', name: 'Jane Smith', email: 'jane@example.com', role: 'USER', status: 'Active', joinedAt: '2024-02-14' },
  { id: 'usr_4', name: 'Mike Johnson', email: 'mike@example.com', role: 'USER', status: 'Suspended', joinedAt: '2024-03-01' },
];

export default function AdminUsers() {
  const [search, setSearch] = useState('');

  const filteredUsers = dummyUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === 'ADMIN' ? (
                      <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 hover:bg-violet-500/20">Admin</Badge>
                    ) : (
                      <Badge variant="secondary" className="font-normal">Customer</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.status === 'Active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 'text-destructive border-destructive/20 bg-destructive/10'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.joinedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Send Email">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" title={user.status === 'Active' ? 'Suspend' : 'Activate'}>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
