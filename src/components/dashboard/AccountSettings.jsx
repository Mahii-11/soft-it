import { useState } from "react";
import { Mail, Phone, MapPin, Edit2, Save } from "lucide-react";

export default function AccountSettings({ user }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const contactFields = [
    { label: "Email Address", icon: Mail, type: "email", value: user.email },
    { label: "Phone Number", icon: Phone, type: "tel", value: user.phone },
  ];

  const addressFields = [
    { label: "Shipping Address", icon: MapPin, type: "textarea", value: user.address },
  ];

  const preferencesFields = [
    { label: "Receive promotional emails", checked: true },
    { label: "Order status notifications", checked: true },
    { label: "Weekly newsletter", checked: false },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your profile information and account preferences.</p>
        </div>

        <button 
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="bg-[#5B3DF5] hover:bg-[#4A2EE0] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-[#5B3DF5]/20 transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto"
        >
          {isEditingProfile ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative mt-6">
        <div className="h-32 bg-gradient-to-r from-[#5B3DF5] to-[#8C75F7]"></div>
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12 relative z-10">
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 text-sm mt-1">{user.status}</p>
              <p className="text-slate-400 text-xs mt-2">Member since {user.joined}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Address */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Contact Information</h3>
          <div className="space-y-6">
            {contactFields.map((field, i) => (
              <div key={i}>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <field.icon className="w-4 h-4 text-[#5B3DF5]" />
                  {field.label}
                </label>
                <input 
                  type={field.type} 
                  defaultValue={field.value}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-[#5B3DF5] focus:ring-4 focus:ring-[#5B3DF5]/10 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Address</h3>
          <div className="space-y-6">
            {addressFields.map((field, i) => (
              <div key={i}>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <field.icon className="w-4 h-4 text-[#5B3DF5]" />
                  {field.label}
                </label>
                <textarea 
                  defaultValue={field.value}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-[#5B3DF5] focus:ring-4 focus:ring-[#5B3DF5]/10 transition-all resize-none h-32"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Account Preferences</h3>
        <div className="space-y-4">
          {preferencesFields.map((pref, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-3 rounded-lg transition-colors w-max">
              <input 
                type="checkbox" 
                defaultChecked={pref.checked} 
                className="w-5 h-5 rounded border-slate-300 text-[#5B3DF5] focus:ring-[#5B3DF5]" 
              />
              <span className="text-sm font-medium text-slate-700">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6 mt-6">
        <h3 className="text-lg font-bold text-red-700 mb-3">Danger Zone</h3>
        <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
          Delete Account
        </button>
      </div>
    </>
  );
}