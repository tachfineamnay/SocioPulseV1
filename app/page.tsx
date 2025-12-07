                                <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-wider text-coral-600 uppercase bg-coral-100 rounded-full">
                                    Établissements
                                </span>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    Besoin de renfort ?
                                </h3>
                                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                    Accédez à votre tableau de bord pour gérer vos demandes et trouver des experts qualifiés.
                                </p>

                                <a
                                    href="/dashboard"
                                    className="flex items-center justify-between w-full px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gray-900/20"
                                >
                                    <span className="font-medium">Accéder au Dashboard</span>
                                    <svg className="w-5 h-5 text-gray-300 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div >
                        </div >

    {/* Tile 2: Extras */ }
    < div className = "bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 group" >
        <div className="relative z-10">
            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-wider text-gray-500 uppercase bg-gray-100 rounded-full">
                Extras
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rejoindre l'équipe
            </h3>
            <p className="text-gray-500 text-sm mb-6">
                Proposez vos services et gérez votre emploi du temps en toute liberté.
            </p>

            <a
                href="/auth/login"
                className="flex items-center text-coral-600 font-medium hover:text-coral-700 transition-colors"
            >
                <span className="border-b-2 border-coral-200 group-hover:border-coral-500 transition-colors">Se connecter</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </div>
                        </div >
                    </div >
                </div >
            </div >
        </main >
    );
}
