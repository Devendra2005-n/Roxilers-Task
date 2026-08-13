import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Users, Store as StoreIcon, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroSlider } from '../components/HeroSlider';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState<'users'|'stores'>('users');
  const [data, setData] = useState<any[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Forms state
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER', storeId: '' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });

  const [showEditUser, setShowEditUser] = useState(false);
  const [showEditStore, setShowEditStore] = useState(false);
  const [editUserForm, setEditUserForm] = useState({ id: '', name: '', email: '', password: '', address: '', role: 'NORMAL_USER', storeId: '' });
  const [editStoreForm, setEditStoreForm] = useState({ id: '', name: '', email: '', address: '', ownerId: '' });

  const fetchDashboard = async () => {
    try {
      const res = await client.get('/admin/dashboard');
      setStats(res.data);
    } catch (e) {}
  };

  const fetchData = async () => {
    try {
      const endpoint = activeTab === 'users' ? '/admin/users' : '/stores'; 
      const res = await client.get(endpoint);
      setData(res.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/admin/users', { ...userForm, storeId: userForm.storeId || undefined });
      setShowAddUser(false);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER', storeId: '' });
      fetchData();
      fetchDashboard();
    } catch (e: any) {
      if (Array.isArray(e.response?.data?.errors)) {
        alert(e.response.data.errors.join(', '));
      } else {
        alert(e.response?.data?.message || 'Failed to add user');
      }
    }
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...storeForm, ownerId: storeForm.ownerId || undefined };
    try {
      await client.post('/admin/stores', payload);
      setShowAddStore(false);
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
      fetchData();
      fetchDashboard();
    } catch (e: any) {
      if (Array.isArray(e.response?.data?.errors)) {
        alert(e.response.data.errors.join(', '));
      } else {
        alert(e.response?.data?.message || 'Failed to add store');
      }
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...editUserForm, storeId: editUserForm.storeId || undefined };
      if (!payload.password) delete payload.password;
      delete payload.id;
      await client.patch(`/admin/users/${editUserForm.id}`, payload);
      setShowEditUser(false);
      fetchData();
    } catch (e: any) {
      if (Array.isArray(e.response?.data?.errors)) {
        alert(e.response.data.errors.join(', '));
      } else {
        alert(e.response?.data?.message || 'Failed to update user');
      }
    }
  };

  const handleEditStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...editStoreForm, ownerId: editStoreForm.ownerId || undefined };
      delete payload.id;
      await client.patch(`/admin/stores/${editStoreForm.id}`, payload);
      setShowEditStore(false);
      fetchData();
    } catch (e: any) {
      if (Array.isArray(e.response?.data?.errors)) {
        alert(e.response.data.errors.join(', '));
      } else {
        alert(e.response?.data?.message || 'Failed to update store');
      }
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ padding: '0 1rem' }}>
      <HeroSlider />
      <motion.h1 variants={itemVariants} style={{ marginBottom: '2rem', color: 'white', fontSize: '2.5rem' }}>Overview</motion.h1>
      
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}><Users size={32} color="#60a5fa" /></div>
          <div><h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalUsers}</h3><p style={{ margin: 0, color: '#94a3b8' }}>Total Users</p></div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%' }}><StoreIcon size={32} color="#34d399" /></div>
          <div><h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalStores}</h3><p style={{ margin: 0, color: '#94a3b8' }}>Total Stores</p></div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '50%' }}><Star size={32} color="#fbbf24" /></div>
          <div><h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalRatings}</h3><p style={{ margin: 0, color: '#94a3b8' }}>Total Ratings</p></div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button onClick={() => setActiveTab('users')} style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'users' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'users' ? 'white' : '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, transition: 'all 0.2s' }}>Users</button>
          <button onClick={() => setActiveTab('stores')} style={{ padding: '0.5rem 0', background: 'none', border: 'none', borderBottom: activeTab === 'stores' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'stores' ? 'white' : '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, transition: 'all 0.2s' }}>Stores</button>
        </div>
        
        {activeTab === 'users' && <button className="btn" onClick={() => setShowAddUser(true)} style={{ background: 'var(--color-primary)', color: 'white', padding: '0.6rem 1.2rem', gap: '0.5rem' }}><Plus size={18} /> Add User</button>}
        {activeTab === 'stores' && <button className="btn" onClick={() => setShowAddStore(true)} style={{ background: 'var(--color-primary)', color: 'white', padding: '0.6rem 1.2rem', gap: '0.5rem' }}><Plus size={18} /> Add Store</button>}
      </motion.div>

      <motion.div variants={itemVariants} className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table className="glass-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email / Address</th>
              {activeTab === 'users' ? <th>Role</th> : <th>Rating</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <motion.tr 
                key={item.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.05 }}
                onClick={() => { setSelectedItem(item); setDetailsModalOpen(true); }}
                style={{ cursor: 'pointer' }}
              >
                <td>{item.name}</td>
                <td style={{ color: '#cbd5e1' }}>{activeTab === 'users' ? item.email : item.address}</td>
                <td>
                  {activeTab === 'users' 
                    ? <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{item.role.replace('_', ' ')}</span> 
                    : <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={16} fill="var(--color-star)" color="var(--color-star)" /> {item.averageRating?.toFixed(1) || 0} ({item.totalRatings || 0})</span>
                  }
                </td>
              </motion.tr>
            ))}
            {data.length === 0 && <tr><td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No {activeTab} found</td></tr>}
          </tbody>
        </table>
      </motion.div>

      {/* Add User Modal */}
      {showAddUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '420px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Add New User</h3>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Name</label><input type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required minLength={20} maxLength={60} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Email</label><input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Password</label><input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Address</label><input type="text" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} required maxLength={400} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Role</label>
                <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}>
                  <option value="NORMAL_USER" style={{color: 'black'}}>Normal User</option>
                  <option value="STORE_OWNER" style={{color: 'black'}}>Store Owner</option>
                  <option value="ADMIN" style={{color: 'black'}}>Admin</option>
                </select>
              </div>
              {userForm.role === 'STORE_OWNER' && (
                <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Store ID (Optional UUID)</label><input type="text" value={userForm.storeId} onChange={e => setUserForm({...userForm, storeId: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              )}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn" onClick={() => setShowAddUser(false)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
                <button type="submit" className="btn" style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem' }}>Save User</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Store Modal */}
      {showAddStore && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '420px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Add New Store</h3>
            <form onSubmit={handleAddStore} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Store Name</label><input type="text" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} required maxLength={60} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Email</label><input type="email" value={storeForm.email} onChange={e => setStoreForm({...storeForm, email: e.target.value})} required className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Address</label><input type="text" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} required maxLength={400} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Owner ID (Optional UUID)</label><input type="text" value={storeForm.ownerId} onChange={e => setStoreForm({...storeForm, ownerId: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn" onClick={() => setShowAddStore(false)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
                <button type="submit" className="btn" style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem' }}>Save Store</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '420px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Edit User</h3>
            <form onSubmit={handleEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Name</label><input type="text" value={editUserForm.name} onChange={e => setEditUserForm({...editUserForm, name: e.target.value})} required minLength={20} maxLength={60} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Email</label><input type="email" value={editUserForm.email} onChange={e => setEditUserForm({...editUserForm, email: e.target.value})} required className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Password (Leave blank to keep current)</label><input type="password" value={editUserForm.password} onChange={e => setEditUserForm({...editUserForm, password: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Address</label><input type="text" value={editUserForm.address} onChange={e => setEditUserForm({...editUserForm, address: e.target.value})} required maxLength={400} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Role</label>
                <select value={editUserForm.role} onChange={e => setEditUserForm({...editUserForm, role: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}>
                  <option value="NORMAL_USER" style={{color: 'black'}}>Normal User</option>
                  <option value="STORE_OWNER" style={{color: 'black'}}>Store Owner</option>
                  <option value="ADMIN" style={{color: 'black'}}>Admin</option>
                </select>
              </div>
              {editUserForm.role === 'STORE_OWNER' && (
                <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Store ID (Optional UUID)</label><input type="text" value={editUserForm.storeId} onChange={e => setEditUserForm({...editUserForm, storeId: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              )}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn" onClick={() => setShowEditUser(false)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
                <button type="submit" className="btn" style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem' }}>Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Store Modal */}
      {showEditStore && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '420px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Edit Store</h3>
            <form onSubmit={handleEditStore} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Store Name</label><input type="text" value={editStoreForm.name} onChange={e => setEditStoreForm({...editStoreForm, name: e.target.value})} required maxLength={60} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Email</label><input type="email" value={editStoreForm.email} onChange={e => setEditStoreForm({...editStoreForm, email: e.target.value})} required className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Address</label><input type="text" value={editStoreForm.address} onChange={e => setEditStoreForm({...editStoreForm, address: e.target.value})} required maxLength={400} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div><label style={{display:'block', marginBottom:'0.5rem', color:'#cbd5e1'}}>Owner ID (Optional UUID)</label><input type="text" value={editStoreForm.ownerId} onChange={e => setEditStoreForm({...editStoreForm, ownerId: e.target.value})} className="input-glass" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}/></div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn" onClick={() => setShowEditStore(false)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
                <button type="submit" className="btn" style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem' }}>Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalOpen && selectedItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }} onClick={() => setDetailsModalOpen(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              {activeTab === 'users' ? 'User Details' : 'Store Details'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1.05rem', color: '#e2e8f0' }}>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Email:</strong> {selectedItem.email}</p>
              <p><strong>Address:</strong> {selectedItem.address}</p>
              {activeTab === 'users' ? (
                <>
                  <p><strong>Role:</strong> {selectedItem.role?.replace('_', ' ')}</p>
                  <p><strong>ID:</strong> <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedItem.id}</span></p>
                </>
              ) : (
                <>
                  <p><strong>Owner ID:</strong> <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedItem.ownerId || 'None'}</span></p>
                  <p><strong>Rating:</strong> {selectedItem.averageRating?.toFixed(1) || 0} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>({selectedItem.totalRatings || 0} reviews)</span></p>
                  <p><strong>ID:</strong> <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedItem.id}</span></p>
                </>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem' }}>
              <button type="button" className="btn" onClick={() => {
                setDetailsModalOpen(false);
                if (activeTab === 'users') {
                  setEditUserForm({ id: selectedItem.id, name: selectedItem.name, email: selectedItem.email, password: '', address: selectedItem.address, role: selectedItem.role, storeId: selectedItem.ownedStore?.id || '' });
                  setShowEditUser(true);
                } else {
                  setEditStoreForm({ id: selectedItem.id, name: selectedItem.name, email: selectedItem.email, address: selectedItem.address, ownerId: selectedItem.ownerId || '' });
                  setShowEditStore(true);
                }
              }} style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white' }}>Edit</button>
              <button type="button" className="btn" onClick={() => setDetailsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
