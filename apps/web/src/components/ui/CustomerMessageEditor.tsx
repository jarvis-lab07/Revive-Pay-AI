import React, { useState } from 'react';
import { Button } from './Button';
import { Languages, Save } from 'lucide-react';

interface MessageEditorProps {
  initialMessage: string;
  onSave: (message: string) => void;
  onCancel: () => void;
}

export const CustomerMessageEditor: React.FC<MessageEditorProps> = ({ initialMessage, onSave, onCancel }) => {
  const [message, setMessage] = useState(initialMessage);

  const templates = [
    { name: 'Friendly Reminder', text: 'Hi! Just a friendly reminder that your payment is pending. We have saved your cart for you.' },
    { name: 'Payment Retry', text: "Oops! Your recent payment failed. Don't worry, you can retry using a different payment method." },
    { name: 'Hinglish (Casual)', text: 'Namaste! Aapka payment complete nahi ho paya. Please try again to continue your subscription.' },
  ];

  return (
    <div className="bg-white rounded-xl p-3 border border-border">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-semibold text-ink">Edit customer message</label>
        <div className="relative group">
          <button type="button" className="text-xs text-primary flex items-center gap-1 hover:text-primary-hover transition-colors font-medium">
            <Languages size={14} /> Templates
          </button>
          <div className="absolute right-0 top-6 w-64 bg-white border border-border rounded-xl shadow-lift opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10 p-1.5">
            {templates.map((t) => (
              <div
                key={t.name}
                className="text-xs p-2.5 hover:bg-slate-50 cursor-pointer rounded-lg text-ink-secondary"
                onClick={() => setMessage(t.text)}
              >
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="input-field h-24 resize-none mb-3"
      />

      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={() => onSave(message)}>
          <Save size={14} /> Save
        </Button>
      </div>
    </div>
  );
};
