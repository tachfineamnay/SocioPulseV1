import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-coral-400 to-coral-600"></div>

                    {/* Profile Header */}
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-400 shadow-md">
                                <User className="w-16 h-16" />
                            </div>
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Jean Dupont</h1>
                                <p className="text-coral-600 font-medium">Administrateur Établissement</p>
                            </div>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                Modifier
                            </button>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span>jean.dupont@example.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span>06 12 34 56 78</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span>Paris, France</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <span>Compte Vérifié</span>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <h3 className="font-semibold text-gray-900 mb-4">Établissements rattachés</h3>
                            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">EHPAD Les Jardins</h4>
                                    <p className="text-sm text-gray-500">Administrateur principal</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Actif</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
