import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import useProblemStore from '../../store/problemStore';

const AddProblemModal = ({ isOpen, onClose, onAddProblems, existingProblemIds }) => {
  const { problems, getAllProblems, isProblemsLoading } = useProblemStore();
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      getAllProblems();
    }
  }, [isOpen, getAllProblems]);

  const handleProblemSelection = (problemId) => {
    setSelectedProblems(prev =>
      prev.includes(problemId) ? prev.filter(id => id !== problemId) : [...prev, problemId]
    );
  };

  const handleAddClick = () => {
    if (selectedProblems.length === 0) {
      toast.error('Please select at least one problem to add.');
      return;
    }
    onAddProblems(selectedProblems);
    onClose();
    setSelectedProblems([]);
  };

  const availableProblems = problems.filter(p => !existingProblemIds.includes(p.id));

  const filteredProblems = availableProblems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-2xl">
        <button
          className=" absolute right-2 top-2"
          onClick={onClose}
        >
          <MdClose />
        </button>
        <h3 className="font-bold text-lg mb-4">Add Problems to Playlist</h3>

        <input
          type="text"
          placeholder="Search problems..."
          className="input input-bordered w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isProblemsLoading ? (
          <div className="flex justify-center items-center h-48">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredProblems.map(problem => (
              <div
                key={problem.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedProblems.includes(problem.id)
                    ? 'bg-primary text-primary-content'
                    : 'bg-base-200 hover:bg-base-300'
                }`}
                onClick={() => handleProblemSelection(problem.id)}
              >
                <div className="font-semibold">{problem.title}</div>
                <div className={`badge ${problem.difficulty === 'EASY' ? 'badge-success' : problem.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-error'}`}>
                  {problem.difficulty}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-action mt-6">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddClick}
            disabled={selectedProblems.length === 0}
          >
            Add {selectedProblems.length > 0 ? `(${selectedProblems.length})` : ''} Problems
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default AddProblemModal;
