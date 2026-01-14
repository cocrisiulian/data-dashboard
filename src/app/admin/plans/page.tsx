'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Button } from '@/components/ui/controls/button';
import { Badge } from '@/components/ui/text/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/layout/dialog';
import { Input } from '@/components/ui/controls/input';
import { Label } from '@/components/ui/text/label';
import { Plus, Edit, Trash2, Users, DollarSign, FileText, BarChart, Layout } from 'lucide-react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default function AdminPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    maxFiles: '',
    maxCharts: '',
    maxDashboards: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:4000/api/plans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 403) {
          router.push('/admin/unauthorized');
          return;
        }
        throw new Error('Failed to fetch plans');
      }

      const data = await res.json();
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/admin/plans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          maxFiles: parseInt(formData.maxFiles),
          maxCharts: parseInt(formData.maxCharts),
          maxDashboards: parseInt(formData.maxDashboards)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create plan');
      }

      setShowCreateDialog(false);
      setFormData({ name: '', price: '', maxFiles: '', maxCharts: '', maxDashboards: '' });
      fetchPlans();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdatePlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/admin/plans/${selectedPlan.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          maxFiles: parseInt(formData.maxFiles),
          maxCharts: parseInt(formData.maxCharts),
          maxDashboards: parseInt(formData.maxDashboards)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update plan');
      }

      setShowEditDialog(false);
      setSelectedPlan(null);
      fetchPlans();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/admin/plans/${selectedPlan.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete plan');
      }

      setShowDeleteDialog(false);
      setSelectedPlan(null);
      fetchPlans();
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditDialog = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      maxFiles: plan.max_files.toString(),
      maxCharts: plan.max_charts.toString(),
      maxDashboards: plan.max_dashboards.toString()
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <DashboardNav />
        <div className="flex justify-center items-center h-screen">
          <p>Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Plan Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Create and manage subscription plans
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="text-2xl font-bold text-primary mt-2">
                      ${plan.price}
                      <span className="text-sm font-normal text-slate-600">/month</span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(plan)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>
                      <strong>{plan.max_files === -1 ? '∞' : plan.max_files}</strong> Files
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart className="h-4 w-4 text-slate-400" />
                    <span>
                      <strong>{plan.max_charts === -1 ? '∞' : plan.max_charts}</strong> Charts
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Layout className="h-4 w-4 text-slate-400" />
                    <span>
                      <strong>{plan.max_dashboards === -1 ? '∞' : plan.max_dashboards}</strong> Dashboards
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Create Plan Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>
              Add a new subscription plan with custom limits.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Premium Plan"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (USD/month)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="29.99"
              />
            </div>
            <div>
              <Label htmlFor="maxFiles">Max Files (-1 for unlimited)</Label>
              <Input
                id="maxFiles"
                type="number"
                value={formData.maxFiles}
                onChange={(e) => setFormData({...formData, maxFiles: e.target.value})}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="maxCharts">Max Charts (-1 for unlimited)</Label>
              <Input
                id="maxCharts"
                type="number"
                value={formData.maxCharts}
                onChange={(e) => setFormData({...formData, maxCharts: e.target.value})}
                placeholder="50"
              />
            </div>
            <div>
              <Label htmlFor="maxDashboards">Max Dashboards (-1 for unlimited)</Label>
              <Input
                id="maxDashboards"
                type="number"
                value={formData.maxDashboards}
                onChange={(e) => setFormData({...formData, maxDashboards: e.target.value})}
                placeholder="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreatePlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update plan details and limits.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-name">Plan Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price (USD/month)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-maxFiles">Max Files</Label>
              <Input
                id="edit-maxFiles"
                type="number"
                value={formData.maxFiles}
                onChange={(e) => setFormData({...formData, maxFiles: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-maxCharts">Max Charts</Label>
              <Input
                id="edit-maxCharts"
                type="number"
                value={formData.maxCharts}
                onChange={(e) => setFormData({...formData, maxCharts: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-maxDashboards">Max Dashboards</Label>
              <Input
                id="edit-maxDashboards"
                type="number"
                value={formData.maxDashboards}
                onChange={(e) => setFormData({...formData, maxDashboards: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdatePlan}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedPlan?.name}</strong>? 
              This action cannot be undone and will fail if users are still using this plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePlan}>Delete Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
