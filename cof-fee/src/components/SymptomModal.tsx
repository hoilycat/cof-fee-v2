import { motion } from 'framer-motion';
import { useSetAtom } from 'jotai';
import { symptomLogsAtom, type SymptomLog } from '../hooks/useCaffeineStore';
import { X } from 'lucide-react';

const SYMPTOMS = [
  { id: 'HEADACHE', label: '두통 🤕' },
  { id: 'FATIGUE', label: '무기력/피로 😴' },
  { id: 'CRAMPS', label: '근육경련/떨림 🫨' },
  { id: 'RUNNY_NOSE', label: '콧물/재채기 🤧' },
];

export const SymptomModal = ({ onClose }: { onClose: () => void }) => {
  const setSymptomLogs = useSetAtom(symptomLogsAtom);
  
  const handleRecord = (type: SymptomLog['type']) => {
    const newLog :SymptomLog = {
      id: crypto.randomUUID(),
      type,
      recordTime: new Date().toISOString(),
      severity: 3 as const
    };
    setSymptomLogs(prev => [...prev, newLog]);
    alert("상태가 기록되었습니다. 나중에 통계에서 분석해 드릴게요!");
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4">
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="w-full max-w-md bg-white dark:bg-[#3A312B] rounded-[40px] p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black dark:text-[#F5E8D3]">지금 몸 상태는?</h3>
          <button onClick={onClose} className="p-2 dark:text-[#A3978F]"><X /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SYMPTOMS.map(s => (
            <button key={s.id} onClick={() => handleRecord(s.id as SymptomLog['type'])} className="p-5 rounded-[25px] bg-[#F4F1EA] dark:bg-[#483C32] text-sm font-bold dark:text-[#ECE0D1] hover:scale-95 transition-transform">
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};