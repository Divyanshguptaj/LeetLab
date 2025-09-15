import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { usePlayListStore } from "../store/usePlayListStore";
import {
  Bookmark,
  PencilIcon,
  Trash,
  TrashIcon,
  Plus,
  Info,
  Edit,
} from "lucide-react";
import CreatePlayListModel from "../components/CreatePlayListModel";
import EditProblemModal from "./EditProblemModal";
import AddToPlayListModel from "../components/AddToPlayListModel";
import { set } from "react-hook-form";
import { useProblemStore } from "../store/useProblemStore";

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { createPlayList } = usePlayListStore();
  const { deleteProblem } = useProblemStore();
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [isAddToPlayListModelOpen, setIsAddToPlayListModelOpen] =useState(false);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showDeletedModel, setShowDeletedModel] = useState(false);
  const [deletedProblemId, setDeletedProblemId] = useState(null);
  const [editedProblemId, setEditedProblemId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const difficulties = ["EASY", "MEDIUM", "HARD"];


  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const allCompanyTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const companyTagsSet = new Set();
    problems.forEach((p) =>
      p.companyTags?.forEach((t) =>
        companyTagsSet.add(t)
      )
    );
    return Array.from(companyTagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      )
      .filter((problem) =>
        selectedCompany === "ALL"
          ? true
          : problem.companyTags?.includes(selectedCompany)
      );
  }, [problems, search, difficulty, selectedTag, selectedCompany]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage, // 1 * 5 = 5 ( starting index = 0)
      currentPage * itemsPerPage // 1 * 5  = (0 , 10)
    );
  }, [filteredProblems, currentPage]); 

  const handleDelete = (id) => {
    setDeletedProblemId(id);
    setShowDeletedModel(true);
  };
  const handleSureDelete = async () => {
    deleteProblem(deletedProblemId);
    setShowDeletedModel(false);
  };
  const handleModalClose = () => setShowDeletedModel(false);

  const handleEditProblem = (id) => {
    setEditedProblemId(id);
    setIsEditModalOpen(true);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlayListModelOpen(true);
  };
  const handleCreatePlayList = async (data) => {
    await createPlayList(data);
  };
  const handleSolveDemo = () => {
    setIsDemo(true);
    navigate("/problem/03017f17-0349-4161-b499-a312c35aeb20", {
      state: { isDemo: true },
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto  bg-primary/20 z-20 p-6 rounded-sm mt-10">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex flex-row gap-3 mr-15   items-center justify-center">
          <h2
            className="text-2xl font-bold cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Problems
          </h2>
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex flex-row justify-between gap-3">
            <button
              className="btn btn-primary/20 shadow-md hover:bg-primary/20 "
              onClick={() => handleSolveDemo()}
            >
              Solve Demo
              <div className="relative group">
                <Info className="w-4 h-4 cursor-pointer" />
                <span className="absolute text-left top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 text-sm bg-base-200 rounded shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-50  w-max max-w-xs">
                  New here? Here's sample problem with solution. Run the code to
                  see the working
                </span>
              </div>
            </button>

            <input
              type="text"
              placeholder="Search by title"
              className="input input-bordered w-full md:w-1/5 bg-base-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="select select-bordered bg-base-200 w-full md:w-1/5"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="ALL">All Difficulties</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered bg-base-200 w-full md:w-1/5"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="ALL">All Companies</option>
              {allCompanyTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered bg-base-200 w-full md:w-1/5"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="ALL">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary gap-2"
            onClick={() => {
              setIsCreateModelOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-200">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem.solvedBy.some(
                  (user) => user.userId === authUser?.id
                );

                return (
                  <tr key={problem.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge badge-outline badge-warning text-xs font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge font-semibold text-xs text-white ${
                          problem.difficulty === "EASY"
                            ? "badge-success"
                            : problem.difficulty === "MEDIUM"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                            {showDeletedModel && (
                              <div className="fixed inset-0 flex justify-center items-center  bg-gray-900/50">
                                <div className=" p-4 rounded  shadow-md bg-base-100 ">
                                  <h2 className=" p-2 font-bold">
                                    Confirm Deletion
                                  </h2>
                                  <p className="p-2 text-sm">
                                    Are you sure you want to delete this
                                    problem?
                                  </p>
                                  <div className="flex gap-4 mt-5 mr-4 ml-4 items-center mb-3 justify-between">
                                    <button
                                      className="px-4 py-2 bg-primary/80 font-semibold rounded text-sm cursor-pointer"
                                      onClick={() => {
                                        handleSureDelete();
                                        setShowDeletedModel(false);
                                      }}
                                    >
                                      Yes, Delete
                                    </button>
                                    <button
                                      className="px-4 py-2 outline rounded text-sm cursor-pointer"
                                      onClick={handleModalClose}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            <button
                              className="btn btn-sm bg-base-200 outline-gray-50"
                              onClick={() => handleEditProblem(problem.id)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <button
                          className="btn btn-sm btn-outline flex gap-2 items-center"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Save to Playlist
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  */}
      <div className="flex justify-center mt-6 items-center  gap-2">
        <div className=" outline shadow-sm  btn-group rounded-sm">
          <button
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span className="btn btn-ghost btn-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            className="btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Creating Model */}

      <CreatePlayListModel
        isOpen={isCreateModelOpen} //value of clicked button
        onClose={() => setIsCreateModelOpen(false)}
        onSubmit={handleCreatePlayList} //sending data to backend
      />
      <AddToPlayListModel
        isOpen={isAddToPlayListModelOpen}
        onClose={() => setIsAddToPlayListModelOpen(false)}
        problemId={selectedProblemId}
      />
      <EditProblemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        problemId={editedProblemId} //sending data to backend
      />
    </div>
  );
};

export default ProblemTable;