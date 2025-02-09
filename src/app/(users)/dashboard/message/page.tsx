"use client";
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEnvelopeOpen, FaUser, FaTrash } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function MessageInbox() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const messagesPerPage = 5;

  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const fetchMessages = async () => {
    const { data, error, count } = await supabase
      .from("messages")
      .select("id, name, phone, subject, image, message, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((currentPage - 1) * messagesPerPage, currentPage * messagesPerPage - 1);

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
      setTotalPages(Math.ceil(count / messagesPerPage));
    }
  };

  const handleMessageClick = (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      console.error("Error deleting message:", error);
    } else {
      setMessages(messages.filter((msg) => msg.id !== id));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Inbox</h2>
      <div className="bg-white rounded-xl shadow-md p-4">
        <ul className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <div
                className="flex items-center gap-4 flex-1"
                onClick={() => handleMessageClick(msg)}
              >
                <FaUser className="text-gray-500 text-lg" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{msg.name}</div>
                  <div className="text-sm text-gray-600">{msg.subject}</div>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                {selectedMessage?.id === msg.id ? (
                  <FaEnvelopeOpen className="text-blue-500 text-lg" />
                ) : (
                  <FaEnvelope className="text-gray-500 text-lg" />
                )}
              </div>
              <button
                onClick={() => handleDelete(msg.id)}
                className="text-red-500 hover:text-red-700 transition"
                aria-label="Delete message"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-lg">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {selectedMessage.subject}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              From: {selectedMessage.name}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              {new Date(selectedMessage.created_at).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-2">Name: {selectedMessage.name}</p>
            <p className="text-sm text-gray-600 mb-2">Phone: <Link className="text-blue-600 hover:underline" href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</Link></p>
            <p className="text-gray-700 text-sm mb-4">{selectedMessage.message}</p>
            {selectedMessage.image && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={selectedMessage.image}
                  width={150}
                  height={150}
                  alt="Message Image"
                  className="rounded-lg shadow-sm"
                />
              </div>
            )}
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
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
