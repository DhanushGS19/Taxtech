import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FamilyProfile } from '../../types/tax';
import {
  Users,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  UserCheck,
  HeartHandshake,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export const FamilyProfilesTab: React.FC = () => {
  const {
    profiles,
    activeProfile,
    setActiveProfileId,
    addProfile,
    formatPrivateAmount
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [pan, setPan] = useState('');
  const [upiId, setUpiId] = useState('');
  const [age, setAge] = useState(30);
  const [employmentType, setEmploymentType] = useState<FamilyProfile['employmentType']>('SALARIED');
  const [defaultRegime, setDefaultRegime] = useState<'NEW' | 'OLD'>('NEW');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: FamilyProfile = {
      id: `prof-${Date.now()}`,
      name,
      relationship,
      pan: pan.toUpperCase() || 'ABCDE1234F',
      upiId: upiId || `${name.toLowerCase().replace(/\s+/g, '')}@okaxis`,
      age,
      residentStatus: 'RESIDENT',
      employmentType,
      hasPresumptiveIncome: employmentType === 'FREELANCER_PROFESSIONAL',
      avatarColor: 'bg-[#5F259F]',
      defaultRegime
    };

    addProfile(newProfile);
    setIsAddOpen(false);
    setName('');
    setPan('');
    setUpiId('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#172033]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F259F]/10 text-[#5F259F] text-xs font-bold border border-[#5F259F]/20 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Multi-Member Household Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#172033]">
            Family Budget Mode & Member Profiles
          </h1>
          <p className="text-xs text-[#718096]">
            Manage shared household spending, individual UPI IDs, and multi-member legal tax optimization.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* AI CA Family Tax Optimization Advice Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-[#5F259F] text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>CA Vikram's Family Tax Advice</span>
        </div>
        <p className="text-xs text-[#718096] leading-relaxed max-w-3xl">
          By structuring household expenses across members, your family can maximize aggregate Section 80C, 80D, and HRA exemptions. For example, paying house rent to mother Anita Sharma (who is in the senior citizen nil tax slab) yields legal HRA tax savings for Rahul under Section 10(13A).
        </p>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {profiles.map(p => {
          const isActive = p.id === activeProfile.id;

          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl border transition-all relative ${
                isActive
                  ? 'bg-white border-[#5F259F] ring-2 ring-[#5F259F]/20 shadow-xs'
                  : 'bg-white border-[#E2E8F0] hover:border-slate-300 shadow-xs'
              }`}
            >
              {isActive && (
                <div className="absolute top-4 right-4 bg-[#16A36A] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active Profile</span>
                </div>
              )}

              <div className="flex items-start gap-3.5 mb-4">
                <div className={`w-12 h-12 rounded-xl ${isActive ? 'bg-[#5F259F]' : 'bg-slate-700'} text-white flex items-center justify-center font-black text-lg shadow-xs`}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#172033]">{p.name}</h3>
                  <div className="text-xs text-[#718096] font-medium">
                    {p.relationship} • {p.age} yrs
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8F9FC] text-[#718096] border border-[#E2E8F0]">
                    {p.employmentType.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#E2E8F0] text-xs">
                <div className="flex justify-between">
                  <span className="text-[#718096]">UPI ID</span>
                  <span className="font-mono text-[#5F259F] font-semibold">{p.upiId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">PAN Card</span>
                  <span className="font-mono font-semibold text-[#172033]">{p.pan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Default Regime</span>
                  <span className="font-bold text-[#16A36A]">{p.defaultRegime} Regime</span>
                </div>
              </div>

              {!isActive && (
                <button
                  onClick={() => setActiveProfileId(p.id)}
                  className="mt-5 w-full py-2 rounded-xl bg-[#F8F9FC] hover:bg-[#5F259F]/10 hover:text-[#5F259F] text-[#172033] font-bold text-xs border border-[#E2E8F0] transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch to this Profile</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-extrabold text-[#172033]">Add Family Member Profile</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#718096] hover:text-[#172033] font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#718096] font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#5F259F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#718096] font-bold mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#5F259F]"
                  >
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#718096] font-bold mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#5F259F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#718096] font-bold mb-1">PAN Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-[#172033] uppercase focus:outline-none focus:border-[#5F259F]"
                  />
                </div>

                <div>
                  <label className="block text-[#718096] font-bold mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@okaxis"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#5F259F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#718096] font-bold mb-1">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#5F259F]"
                >
                  <option value="SALARIED">Salaried Employee</option>
                  <option value="FREELANCER_PROFESSIONAL">Freelancer / Professional (Sec 44ADA)</option>
                  <option value="BUSINESS">Small Business Owner</option>
                  <option value="SENIOR_CITIZEN_PENSIONER">Senior Citizen Pensioner</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F9FC] font-bold text-[#718096] hover:text-[#172033]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5F259F] hover:bg-[#35145F] text-white font-bold transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
