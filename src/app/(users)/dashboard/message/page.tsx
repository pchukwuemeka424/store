"use client";
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaEnvelopeOpen, FaUser } from 'react-icons/fa';
import { createClient } from '@/utils/supabase/client';

export default function MessageInbox() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('id, name, phone, subject, image, message, created_at');

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data);
            }
        };

        fetchMessages();
    }, []);

    const handleMessageClick = (msg) => {
        setSelectedMessage(msg);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Inbox</h2>
            <div className="border rounded-lg overflow-hidden shadow-lg">
                <ul className="divide-y">
                    {messages.map((msg) => (
                        <li
                            key={msg.id}
                            className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleMessageClick(msg)}
                        >
                            <FaUser className="text-gray-500" />
                            <div className="flex-1">
                                <div className="font-semibold">{msg.name}</div>
                                <div className="text-sm text-gray-600">{msg.subject}</div>
                            </div>
                            <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                            {selectedMessage?.id === msg.id ? (
                                <FaEnvelopeOpen className="text-blue-500" />
                            ) : (
                                <FaEnvelope className="text-gray-500" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal */}
            {isModalOpen && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h3 className="text-lg font-bold mb-2">{selectedMessage.subject}</h3>
                        <p className="text-sm text-gray-600 mb-2">From: {selectedMessage.name}</p>
                        <p>{selectedMessage.message}</p>
                        <button
                            className="mt-4 text-blue-500 hover:text-blue-700"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
