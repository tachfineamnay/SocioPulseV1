'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send } from 'lucide-react';
import { ToastContainer, useToasts } from '@/components/ui/Toast';
import { sendMessage } from '@/app/services/message.service';

export default function MessagesPage() {
    const searchParams = useSearchParams();
    const recipientId = useMemo(() => searchParams.get('recipientId'), [searchParams]);
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { toasts, addToast, removeToast } = useToasts();

    const handleSend = useCallback(async () => {
        if (!recipientId) {
            addToast({ message: 'Aucun destinataire selectionne.', type: 'warning' });
            return;
        }

        if (!content.trim()) {
            addToast({ message: 'Le message ne peut pas etre vide.', type: 'warning' });
            return;
        }

        setIsSending(true);
        try {
            await sendMessage(recipientId, content.trim());
            addToast({ message: 'Message envoye !', type: 'success' });
            setContent('');
        } catch (error) {
            console.error('sendMessage error', error);
            addToast({ message: "Erreur lors de l'envoi du message.", type: 'error' });
        } finally {
            setIsSending(false);
        }
    }, [addToast, content, recipientId]);

    return (
        <div className="min-h-screen bg-slate-50">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-100">
                    <h1 className="text-xl font-semibold text-slate-900 mb-4">Messagerie</h1>

                    {recipientId ? (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500">
                                Envoyer un message a l&apos;utilisateur <span className="font-semibold text-slate-900">{recipientId}</span>
                            </p>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Ecrivez votre message..."
                                className="w-full min-h-[150px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={isSending}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-coral-500 hover:bg-coral-600 transition-colors ${isSending ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <Send className="w-4 h-4" />
                                    {isSending ? 'Envoi...' : 'Envoyer'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-sm text-slate-500">Selectionnez une conversation pour commencer.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
