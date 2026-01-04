import { useEffect, useState } from 'react';
import { User, PlusCircle, X, Shield } from 'lucide-react';

const Team = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [showAddUserModal, setShowAddUserModal] = useState(false);

    // Add User Form State
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'member' });

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { // Reusing this endpoint as it returns all users
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            // Sort: Admins first, then others
            const sorted = data.sort((a, b) => {
                if (a.role === 'admin' && b.role !== 'admin') return -1;
                if (a.role !== 'admin' && b.role === 'admin') return 1;
                return a.username.localeCompare(b.username);
            });

            setUsers(sorted);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePromoteToAdmin = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin'; // Toggle logic if needed, but primary req is make admin

        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                alert(`User role updated to ${newRole}`);
                fetchUsers();
            } else {
                alert('Failed to update role');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            const data = await res.json();

            if (res.ok) {
                alert('User added successfully! They are now in the "Pending Users" list waiting for approval.');
                setShowAddUserModal(false);
                setNewUser({ username: '', email: '', password: '', role: 'member' }); // Reset form
                // Do NOT fetchUsers() here because the user is not approved yet, so they won't show up in the main list.
            } else {
                alert(data.message || 'Failed to add user');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Team Directory</h1>
            </div>

            <div className="team-grid">
                {users.map(user => (
                    <div
                        key={user._id}
                        className="glass-card"
                        style={{
                            padding: '1.5rem',
                            cursor: 'default',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'row', // Horizontal layout for 2xN grid
                            alignItems: 'center',
                            gap: '1.5rem',
                            textAlign: 'left'
                        }}
                    >
                        {user.role === 'admin' && (
                            <span style={{
                                position: 'absolute', top: '10px', right: '10px',
                                background: 'var(--color-blue)', color: 'white',
                                fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px'
                            }}>
                                ADMIN
                            </span>
                        )}

                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'var(--bg-dark)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-muted)',
                            flexShrink: 0
                        }}>
                            <User size={40} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>{user.username}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', textTransform: 'capitalize' }}>{user.role}</p>

                            {/* Make Admin Button */}
                            {currentUser.role === 'admin' && user._id !== currentUser.id && (
                                <button
                                    onClick={() => handlePromoteToAdmin(user._id, user.role)}
                                    style={{
                                        marginTop: '10px',
                                        background: 'transparent',
                                        border: '1px solid var(--color-blue)',
                                        color: 'var(--color-blue)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <Shield size={14} />
                                    {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Member Card (Admin Only) */}
                {currentUser.role === 'admin' && (
                    <div
                        className="glass-card"
                        style={{
                            padding: '1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1.5rem',
                            border: '1px dashed var(--text-muted)',
                            background: 'rgba(255,255,255,0.02)'
                        }}
                        onClick={() => setShowAddUserModal(true)}
                    >
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'var(--color-blue)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(66, 133, 244, 0.3)'
                        }}>
                            <PlusCircle size={30} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Add Member</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Invite new user</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Add User Modal (Admin Only) */}
            {showAddUserModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
                }}>
                    <div className="glass-card" style={{ padding: '2rem', width: '400px', position: 'relative' }}>
                        <button
                            onClick={() => setShowAddUserModal(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add New Member</h2>
                        <form onSubmit={handleAddUser}>
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" name="username" className="input-field" required onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" className="input-field" required onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" className="input-field" required onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select name="role" className="input-field" onChange={handleInputChange}>
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Create User</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
