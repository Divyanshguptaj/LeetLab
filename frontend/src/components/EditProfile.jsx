import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { X, Star } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import UpgradePremium from "./UpgradePremium";

const EditProfile = ({ isOpen, onClose, onSubmit }) => {
  const { handleSubmit, register, reset } = useForm();
  const [isToggled, setIsToggled] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // State to track premium status

  const handleToggle = (checked) => {
    setIsToggled(checked);
  };

  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    navigate("/");
    window.location.reload(); // Hard refresh
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-xl font-bold">Edit Profile</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* Email Field */}
          <div className="form-control mb-4">
            <label className=" mb-4">Email</label>
            <input
              type="text"
              className="input input-bordered w-full mt-2"
              placeholder="Enter email"
              defaultValue={authUser.email}
              disabled
              {...register("email")}
            />
          </div>

          {/* Role Toggle */}
          <div className="mb-6">
            <div className="form-control flex flex-row justify-between">
              <label className="flex items-center gap-2">Switch Roles:</label>
              <input
                type="checkbox"
                checked={isToggled}
                onChange={(e) => handleToggle(e.target.checked)}
                className="toggle toggle-primary"
              />
            </div>
            <p className="text-0.45 text-xs  text-gray-500 ">
              Your current role is {authUser.role}.
            </p>
          </div>

          {/* Image Upload (Disabled for Non-Premium Users) */}
          <div className="form-control">
            <div className="flex flex-col">
              <label className="">Profile Picture</label>
              <input
                type="file"
                className=" input input-bordered w-full text-xs text-center py-2.5 px-3 cursor-pointer  mt-2"
                disabled={!isPremium}
                // {...register("image")}
              />
            </div>
            {!isPremium && (
              <p className="text-xs text-orange-400 mt-2">
                Upgrade to Premium to upload.
              </p>
            )}
            <button
              type="button"
              onClick={() => setIsPremium(true)}
              className="btn btn-outline btn-primary mt-3 mb-5"
            >
              <Star className="w-4.5 h-5 "></Star>
              Upgrade to Premium
            </button>
            <UpgradePremium
              isOpen={isPremium}
              onClose={() => setIsPremium(false)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-2 mt-7">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-outline"
            >
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;