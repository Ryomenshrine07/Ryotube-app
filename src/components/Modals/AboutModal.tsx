import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDescription: string;
  currentLinks: {
    website?: string;
    twitter?: string;
    github?: string;
  };
  onSave: (data: { description: string; website?: string; twitter?: string; github?: string }) => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, currentDescription, currentLinks, onSave }) => {
  const [description, setDescription] = useState(currentDescription);
  const [website, setWebsite] = useState(currentLinks.website || '');
  const [twitter, setTwitter] = useState(currentLinks.twitter || '');
  const [github, setGithub] = useState(currentLinks.github || '');

  const handleSave = () => {
    onSave({ description, website, twitter, github });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-lg p-6 w-[500px]"
      >
        <h2 className="text-white text-lg font-semibold mb-4">Edit About</h2>
        <div className="flex flex-col gap-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Channel Description"
            rows={4}
            className="bg-gray-800 text-white p-2 rounded"
          />
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website Link"
            className="bg-gray-800 text-white p-2 rounded"
          />
          <input
            type="text"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="Twitter Link"
            className="bg-gray-800 text-white p-2 rounded"
          />
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="GitHub Link"
            className="bg-gray-800 text-white p-2 rounded"
          />
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

export default AboutModal;
