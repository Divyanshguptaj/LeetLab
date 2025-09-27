import React from "react";
import {
    X,
    CheckCircle2,
    XCircle,
    Clock,
    MemoryStick as Memory,
    Calendar,
    Code,
    User,
    Hash,
} from "lucide-react";

const SubmissionModal = ({ submission, isOpen, onClose }) => {
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

    const getDetailedStats = (data) => {
        const parsedData = safeParse(data);
        return parsedData.length > 0 ? parsedData : ["N/A"];
    };

    if (!isOpen || !submission) return null;

    const avgMemory = calculateAverageMemory(submission.memory);
    const avgTime = calculateAverageTime(submission.time);
    const timeDetails = getDetailedStats(submission.time);
    const memoryDetails = getDetailedStats(submission.memory);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-base-100 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-base-300">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">Submission Details</h2>
                        {submission.status === "Accepted" ? (
                            <div className="flex items-center gap-2 text-success text-green-300">
                                <CheckCircle2 className="w-6 h-6" />
                                <span className="font-semibold">Accepted</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-error text-red-300">
                                <XCircle className="w-6 h-6" />
                                <span className="font-semibold">{submission.status}</span>
                            </div>
                        )}
                    </div>
                    <X className="w-5 h-5 rounded-full text-white m-3 cursor-pointer" onClick={onClose} />

                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="bg-base-200 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Code className="w-4 h-4 text-base-content/70" />
                                <span className="text-sm font-medium text-base-content/70">
                                    Language
                                </span>
                            </div>
                            <span className="badge badge-neutral">{submission.language}</span>
                        </div>

                        <div className="bg-base-200 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-base-content/70" />
                                <span className="text-sm font-medium text-base-content/70">
                                    Avg Runtime
                                </span>
                            </div>
                            <span className="font-mono">{avgTime.toFixed(3)} s</span>
                        </div>

                        <div className="bg-base-200 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Memory className="w-4 h-4 text-base-content/70" />
                                <span className="text-sm font-medium text-base-content/70">
                                    Avg Memory
                                </span>
                            </div>
                            <span className="font-mono">{avgMemory.toFixed(0)} KB</span>
                        </div>
                    </div>

                    {/* Submission Date */}
                    <div className="bg-base-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-base-content/70" />
                            <span className="font-medium">Submitted On</span>
                        </div>
                        <span className="text-base-content/70">
                            {new Date(submission.createdAt).toLocaleString()}
                        </span>
                    </div>

                    {/* Source Code */}
                    <div className="bg-base-200 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Source Code
                        </h3>
                        <div className="bg-base-300 p-4 rounded-lg max-h-96 overflow-auto">
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                                <code>{submission.sourceCode || "// Source code not available"}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-base-300">
                    <button onClick={onClose} className="btn btn-primary">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionModal;