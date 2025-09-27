import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
  Eye,
} from "lucide-react";
  import SubmissionModal from "../components/modals/SubmissionModal"; // Adjust the import path as needed

const SubmissionsList = ({ submissions, isLoading }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const safeParse = (data) => {
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((submission) => {
          const avgMemory = calculateAverageMemory(submission.memory);
          const avgTime = calculateAverageTime(submission.time);

          return (
            <div
              key={submission.id}
              className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg cursor-pointer hover:scale-[1.02] group"
              onClick={() => handleSubmissionClick(submission)}
            >
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  {/* Left Section: Status and Language */}
                  <div className="flex items-center gap-4">
                    {submission.status === "Accepted" ? (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="font-semibold">Accepted</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-error">
                        <XCircle className="w-6 h-6" />
                        <span className="font-semibold">{submission.status}</span>
                      </div>
                    )}
                    <div className="badge badge-neutral">{submission.language}</div>
                  </div>

                  {/* Right Section: Runtime, Memory, Date, and View Button */}
                  <div className="flex items-center gap-4 text-base-content/70">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{avgTime.toFixed(3)} s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Memory className="w-4 h-4" />
                      <span>{avgMemory.toFixed(0)} KB</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* View Details Button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex items-center gap-1 text-primary">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View Details</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submission ID (subtle) */}
                <div className="text-xs text-base-content/50 mt-2 font-mono">
                  ID: {submission.id}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <SubmissionModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default SubmissionsList;