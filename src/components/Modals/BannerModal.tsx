import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { setChannelBanner } from '../../services/requestFunctions';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBanner: string;
  currentHead: string;
  currentDesc: string;
  onSave: (data: { file?: File; head: string; desc: string }) => void;
}

const BannerModal: React.FC<BannerModalProps> = ({ isOpen, onClose, currentBanner, currentHead, currentDesc, onSave }) => {
  const [preview, setPreview] = useState<string>(currentBanner);
  const [file, setFile] = useState<File | null>(null);
  const [head, setHead] = useState(currentHead);
  const [desc, setDesc] = useState(currentDesc);
  const {user} = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
    }
  };

  const handleSave = async() => {
     
    // const formData = new FormData();
    //       if(user?.channel) formData.append("channelId",user?.channel.id.toString());
    //       if(user?.channel && file) formData.append("banner-pic",URL.createObjectURL(file).toString());
    //       const bannerResponnse = await setChannelBanner(formData);
    onSave({ file: file || undefined, head, desc });
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
        <h2 className="text-white text-lg font-semibold mb-4">Edit Banner</h2>
        <div className="flex flex-col gap-4">
          <img src={preview} alt="Banner Preview" className="w-full h-40 object-cover rounded-lg" />
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-gray-300" />
          <input
            type="text"
            value={head}
            onChange={(e) => setHead(e.target.value)}
            placeholder="Banner Heading"
            className="bg-gray-800 text-white p-2 rounded"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Banner Description"
            rows={3}
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

export default BannerModal;
