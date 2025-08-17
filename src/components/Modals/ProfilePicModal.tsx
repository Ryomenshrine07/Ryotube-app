import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPic: string;
  onSave: (newPic: File) => void;
}

const ProfilePicModal: React.FC<ProfilePicModalProps> = ({ isOpen, onClose, currentPic, onSave }) => {
  const [preview, setPreview] = useState<string>(currentPic);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
    }
  };

  const handleSave = () => {
    if (file) {
      onSave(file);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-lg p-6 w-96"
      >
        <h2 className="text-white text-lg font-semibold mb-4">Edit Profile Picture</h2>
        <div className="flex flex-col items-center gap-4">
          <img src={preview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-gray-800" />
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-gray-300" />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-300">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white">
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePicModal;
