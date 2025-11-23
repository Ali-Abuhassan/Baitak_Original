import React, { useState } from "react";
import GuestServiceRequest from "./GuestServiceRequest";

export default function ServiceReqModal({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* The Trigger */}
      {children({ setOpen })}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg relative p-6 overflow-y-auto max-h-[90vh]">

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            {/* Your full form component */}
            <GuestServiceRequest />
          </div>
        </div>
      )}
    </>
  );
}
