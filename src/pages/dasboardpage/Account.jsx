 import { Settings, Package, MessageSquare, LifeBuoy} from "lucide-react"
import { Link } from "react-router-dom";
 
 
 const user = {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Commerce St, Suite 4B\nNew York, NY 10001",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  };

export default function Account() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full relative overflow-hidden">
                <div className="h-24 bg-linear-to-r from-[#5B3DF5] to-[#8C75F7]"></div>
                <div className="p-6 pt-0 flex-1 flex flex-col relative">
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-4 border-white shadow-sm object-cover absolute -top-10 left-6 bg-white"
                    data-testid="img-avatar-profile"
                  />
                  <div className="mt-12 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900" data-testid="text-profile-name">{user.name}</h2>
                      <p className="text-slate-500 text-sm">Member since 2022</p>
                    </div>
                    <Link href="/dashboard/profile" className="text-slate-400 hover:text-[#5B3DF5] transition-colors p-2 hover:bg-[#5B3DF5]/10 rounded-full cursor-pointer" data-testid="button-profile-settings">
                      <Settings className="w-5 h-5" />
                    </Link>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Email</p>
                        <p className="text-sm text-slate-800" data-testid="text-profile-email">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                        <LifeBuoy className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Phone</p>
                        <p className="text-sm text-slate-800" data-testid="text-profile-phone">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-slate-50 rounded-lg text-slate-400">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Default Address</p>
                        <p className="text-sm text-slate-800 whitespace-pre-line" data-testid="text-profile-address">{user.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <Link href="/dashboard/profile" className="block w-full text-center py-2.5 px-4 border border-[#5B3DF5]/20 text-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white rounded-lg text-sm font-medium transition-all focus:ring-4 focus:ring-[#5B3DF5]/10 cursor-pointer" data-testid="button-edit-profile">
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
  )
}
