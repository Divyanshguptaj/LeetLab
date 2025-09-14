import React from 'react'
import {useForm} from 'react-hook-form'
import {X} from 'lucide-react'

const CreatePlayListModel = ({isOpen, onClose, onSubmit})=>{
    const {register, handleSubmit, formState:{errors}, reset}=useForm();
    const handleFormSubmit= async (data) => {
        await onSubmit(data);
        reset();
        onClose();
        
    }
    if(!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b border-base-300">
            <h3 className="text-xl font-bold ml-2">Create New Playlist</h3>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="p-6 space-y-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mb-2">
                  Playlist Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter playlist name"
                {...register("name", { required: "Playlist name is required" })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mt-2 mb-2">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 mb-2  w-full"
                placeholder="Enter playlist description"
                {...register("description")}
              />
            </div>

            <div className="flex justify-between gap-2 mt-8 ">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-outline"
              >
                Back
              </button>{" "}
              <div className="flex justify-end gap-2 ">
                {/* added reset button */}
                <button
                  type="button"
                  onClick={reset}
                  className="btn btn-ghost btn-outline"
                >
                  Reset
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Playlist
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );


}

export default CreatePlayListModel;